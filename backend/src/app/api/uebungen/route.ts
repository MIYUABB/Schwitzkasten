import { supabaseForToken } from "@/lib/supabaseClient";
import { send, bearer } from "@/lib/http";

export async function GET(req: Request) {
    const token = bearer(req);
    if (!token) return send({ error: "Kein Token" }, 401);

    const sb = supabaseForToken(token);
    const { data, error } = await sb
        .from("uebungen")
        .select("id,name,zielmuskulatur")
        .order("name", { ascending: true });

    if (error) return send({ error: error.message }, 400);
    return send(data);
}
