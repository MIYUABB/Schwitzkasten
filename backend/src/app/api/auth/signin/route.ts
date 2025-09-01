import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL!;
const anon = process.env.SUPABASE_ANON_KEY!;

const schema = z.object({ email: z.string().email(), password: z.string().min(6) });

export async function POST(req: Request){
    const body = await req.json().catch(()=> ({}));
    const p = schema.safeParse(body);
    if(!p.success) return NextResponse.json({ error: "Ungueltige Eingaben" }, { status: 400 });
    const supa = createClient(url, anon);
    const { data, error } = await supa.auth.signInWithPassword(p.data);
    if(error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
}
