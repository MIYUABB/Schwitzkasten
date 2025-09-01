import { NextResponse } from "next/server";
import { supabaseForToken } from "@/src/lib/supabaseClient";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const type = url.searchParams.get("type"); // mit_gewicht | ohne_gewicht

    const sb = supabaseForToken();
    let q = sb.from("uebungen").select("*").order("name", { ascending: true });
    if (type) q = q.eq("typ", type);

    const { data, error } = await q;
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
}
