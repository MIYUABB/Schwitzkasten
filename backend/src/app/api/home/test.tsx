// /app/api/lehrer/verhaltensvereinbarung/route.ts

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
);

export async function GET() {
    const { data, error } = await supabase
        .from('Schueler')
        .select('vorname, nachname, klasse');

    if (error) return NextResponse.json({ error: error.message });

    return NextResponse.json(data);
}

export async function PATCH(req: Request) {
    const body = await req.json();
    const { schueler_id, freigabe } = body;

    const { error } = await supabase
        .from('Schueler')
        .update({ freigabe })
        .eq('schueler_id', schueler_id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
}

