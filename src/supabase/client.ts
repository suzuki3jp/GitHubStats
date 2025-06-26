import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseEnv } from "./env";

export async function createClient() {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = await getSupabaseEnv();

  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
