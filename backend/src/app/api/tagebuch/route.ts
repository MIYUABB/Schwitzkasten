import { supabaseForToken } from "@/lib/supabaseClient";
import { send, bearer } from "@/lib/http";

export async function GET(req: Request) {
    const token = bearer(req);
    if (!token) return send({ error: "Kein Token" }, 401);

    const sb = supabaseForToken(token);
    const url = new URL(req.url);
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");

    let q = sb.from("tagebuch_entries").select("*").order("datum", { ascending: false });
    if (from) q = q.gte("datum", from);
    if (to) q = q.lte("datum", to);

    const { data, error } = await q;
    if (error) return send({ error: error.message }, 400);
    return send(data);
}

export async function POST(req: Request) {
    const token = bearer(req);
    if (!token) return send({ error: "Kein Token" }, 401);

    const sb = supabaseForToken(token);
    const { data: u } = await sb.auth.getUser();
    if (!u?.user) return send({ error: "Kein User" }, 401);

    const body = await req.json().catch(() => ({}));
    const payload = { ...body, user_id: u.user.id };

    const { data, error } = await sb
        .from("tagebuch_entries")
        .insert(payload)
        .select("*")
        .single();

    if (error) return send({ error: error.message }, 400);
    return send(data, 201);
}

export async function DELETE(req: Request) {
    const token = bearer(req);
    if (!token) return send({ error: "Kein Token" }, 401);

    const sb = supabaseForToken(token);
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return send({ error: "ID fehlt" }, 400);

    const { error } = await sb.from("tagebuch_entries").delete().eq("id", id);
    if (error) return send({ error: error.message }, 400);
    return send({ success: true });
}
