import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { send } from "@/lib/http";
import { SUPABASE_URL, SUPABASE_ANON_KEY, ensureEnv } from "@/lib/env";

const schema = z.object({ email: z.string().email(), password: z.string().min(6) });

export async function POST(req: Request) {
    ensureEnv();
    const body = await req.json().catch(() => ({}));
    const p = schema.safeParse(body);
    if (!p.success) return send({ error: "Ungueltige Eingaben", detail: p.error.flatten() }, 400);

    const supa = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await supa.auth.signInWithPassword(p.data);
    if (error) return send({ error: error.message }, 400);

    const { session, user } = data;
    return send({
        access_token: session?.access_token ?? null,
        refresh_token: session?.refresh_token ?? null,
        user,
    });
}
