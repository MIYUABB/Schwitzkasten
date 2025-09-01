create table if not exists schueler (
  schueler_id uuid primary key references auth.users(id) on delete cascade,
  vorname text,
  nachname text,
  klasse text,
  benutzername text,
  email text
);
alter table schueler enable row level security;

create table if not exists lehrpersonen (
  lehrperson_id uuid primary key references auth.users(id) on delete cascade,
  vorname text,
  nachname text,
  benutzername text,
  email text
);
alter table lehrpersonen enable row level security;

create table if not exists geraet (
  geraete_id uuid primary key default gen_random_uuid(),
  name text not null,
  beschreibung text,
  zielmuskulatur text,
  bildurl text,
  videourl text
);
alter table geraet enable row level security;

create table if not exists uebung (
  uebung_id uuid primary key default gen_random_uuid(),
  name text not null,
  beschreibung text,
  zielmuskulatur text,
  geraete_id uuid references geraet(geraete_id) on delete set null
);
alter table uebung enable row level security;

create table if not exists trainingsplan (
  plan_id uuid primary key default gen_random_uuid(),
  titel text not null,
  lehrperson_id uuid not null references lehrpersonen(lehrperson_id) on delete cascade,
  freigegeben boolean default false,
  created_at timestamptz default now()
);
alter table trainingsplan enable row level security;

create table if not exists trainingsplan_uebung (
  plan_id uuid references trainingsplan(plan_id) on delete cascade,
  uebung_id uuid references uebung(uebung_id) on delete restrict,
  saetze int,
  wiederholungen int,
  reihenfolge int,
  primary key (plan_id, uebung_id)
);
alter table trainingsplan_uebung enable row level security;

create table if not exists tagebuch (
  tagebuch_id uuid primary key default gen_random_uuid(),
  schueler_id uuid not null references schueler(schueler_id) on delete cascade,
  datum date not null default now(),
  feedback text
);
alter table tagebuch enable row level security;

create table if not exists tagebuch_uebung (
  tagebuch_id uuid references tagebuch(tagebuch_id) on delete cascade,
  uebung_id uuid references uebung(uebung_id) on delete set null,
  dauer int,
  kommentar text,
  primary key (tagebuch_id, uebung_id)
);
alter table tagebuch_uebung enable row level security;

create or replace view uebung_katalog as
  select u.*, g.name as geraet_name
  from uebung u
  left join geraet g on g.geraete_id = u.geraete_id;

create policy "geraet select alle" on geraet for select using (true);
create policy "uebung select alle" on uebung for select using (true);

create policy "schueler select self" on schueler for select using (auth.uid() = schueler_id);
create policy "schueler update self" on schueler for update using (auth.uid() = schueler_id);

create policy "lehrpersonen select self" on lehrpersonen for select using (auth.uid() = lehrperson_id);
create policy "lehrpersonen update self" on lehrpersonen for update using (auth.uid() = lehrperson_id);

create policy "plan select owner oder freigegeben"
  on trainingsplan for select
  using (
    lehrperson_id = auth.uid()
    or exists(select 1 from schueler s where s.schueler_id = auth.uid()) and freigegeben = true
  );

create policy "plan insert nur lehrperson"
  on trainingsplan for insert
  with check ( lehrperson_id = auth.uid() );

create policy "plan update nur owner"
  on trainingsplan for update
  using ( lehrperson_id = auth.uid() );

create policy "pu select owner oder freigegeben"
  on trainingsplan_uebung for select
  using (
    exists(select 1 from trainingsplan t where t.plan_id = trainingsplan_uebung.plan_id
           and (t.lehrperson_id = auth.uid() or t.freigegeben = true))
  );

create policy "pu write nur owner"
  on trainingsplan_uebung for all
  using ( exists(select 1 from trainingsplan t where t.plan_id = trainingsplan_uebung.plan_id and t.lehrperson_id = auth.uid()) )
  with check ( exists(select 1 from trainingsplan t where t.plan_id = trainingsplan_uebung.plan_id and t.lehrperson_id = auth.uid()) );

create policy "tagebuch select own oder lehrperson"
  on tagebuch for select
  using (
    schueler_id = auth.uid()
    or exists(select 1 from lehrpersonen l where l.lehrperson_id = auth.uid())
  );

create policy "tagebuch insert own"
  on tagebuch for insert
  with check ( schueler_id = auth.uid() );

create policy "tagebuch update delete own oder lehrperson"
  on tagebuch for update using (
    schueler_id = auth.uid()
    or exists(select 1 from lehrpersonen l where l.lehrperson_id = auth.uid())
  )
  with check (
    schueler_id = auth.uid()
    or exists(select 1 from lehrpersonen l where l.lehrperson_id = auth.uid())
  );

create policy "tbu select own oder lehrperson"
  on tagebuch_uebung for select
  using (
    exists(select 1 from tagebuch t where t.tagebuch_id = tagebuch_uebung.tagebuch_id
           and (t.schueler_id = auth.uid() or exists(select 1 from lehrpersonen l where l.lehrperson_id = auth.uid())))
  );

create policy "tbu write own"
  on tagebuch_uebung for all
  using (
    exists(select 1 from tagebuch t where t.tagebuch_id = tagebuch_uebung.tagebuch_id and t.schueler_id = auth.uid())
  )
  with check (
    exists(select 1 from tagebuch t where t.tagebuch_id = tagebuch_uebung.tagebuch_id and t.schueler_id = auth.uid())
  );
