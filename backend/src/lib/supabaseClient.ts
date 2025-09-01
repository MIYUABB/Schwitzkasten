import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL!;
const anon = process.env.SUPABASE_ANON_KEY!;

export function sb(token?: string) {
    return createClient(url, anon, {
        global: { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    });
}
