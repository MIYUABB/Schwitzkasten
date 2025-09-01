import { NextResponse } from "next/server";
import { supabaseForToken } from "@/src/lib/supabaseClient";

async function getUserToken(req: Request) {
    const auth = req.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : undefined;
    return token;
}

export async function GET(req: Request) {
    const token = await getUserToken(req);
    if (!token) return NextResponse.json({ error: "Kein Token" }, { status: 401 });

    const sb = supabaseForToken(token);
    const url = new URL(req.url);
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");

    let q = sb.from("tagebuch_entries").select("*").order("datum", { ascending: false });
    if (from) q = q.gte("datum", from);
    if (to) q = q.lte("datum", to);

    const { data, error } = await q;
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
}

export async function POST(req: Request) {
    const token = await getUserToken(req);
    if (!token) return NextResponse.json({ error: "Kein Token" }, { status: 401 });
    const sb = supabaseForToken(token);

    const { data: u } = await sb.auth.getUser();
    if (!u?.user) return NextResponse.json({ error: "Kein User" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const payload = { ...body, user_id: u.user.id };

    const { data, error } = await sb
        .from("tagebuch_entries")
        .insert(payload)
        .select("*")
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data, { status: 201 });
}
