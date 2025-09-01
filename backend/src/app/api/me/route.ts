import { NextResponse } from "next/server";
import { sb } from "@/src/lib/supabaseClient";

export async function GET(req: Request){
    const auth = req.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : undefined;
    if(!token) return NextResponse.json({ error: "Kein Token" }, { status: 401 });
    const client = sb(token);
    const { data: u, error: e1 } = await client.auth.getUser();
    if(e1 || !u?.user) return NextResponse.json({ error: "Ungueltiger Token" }, { status: 401 });
    const { data: l } = await client.from("lehrpersonen").select("lehrperson_id").eq("lehrperson_id", u.user.id).maybeSingle();
    const { data: s } = await client.from("schueler").select("schueler_id").eq("schueler_id", u.user.id).maybeSingle();
    const role = l ? "lehrer" : s ? "schueler" : "unbekannt";
    return NextResponse.json({ user: u.user, role });
}
