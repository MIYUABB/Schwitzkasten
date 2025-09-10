import { supabaseForToken } from "@/lib/supabaseClient";
import { send, bearer } from "@/lib/http";

export async function GET(req: Request) {
    const token = bearer(req);
    if (!token) return send({ error: "Kein Token" }, 401);

    const sb = supabaseForToken(token);
    const { data: u, error: e1 } = await sb.auth.getUser();
    if (e1 || !u?.user) return send({ error: "Ungueltiger Token" }, 401);

    const uid = u.user.id;
    const { data: l } = await sb
        .from("lehrpersonen")
        .select("lehrperson_id")
        .eq("lehrperson_id", uid)
        .maybeSingle();

    const { data: s } = await sb
        .from("schueler")
        .select("schueler_id")
        .eq("schueler_id", uid)
        .maybeSingle();

    const role = l ? "lehrer" : s ? "schueler" : "unbekannt";
    return send({ user: u.user, role });
}
