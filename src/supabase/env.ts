"use server";
import { getEnv } from "@playlistwizard/env";

export async function getSupabaseEnv(): Promise<{
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}> {
  const env = getEnv(["SUPABASE_URL", "SUPABASE_ANON_KEY"]);
  if (env.isErr()) throw env.error;

  const [SUPABASE_URL, SUPABASE_ANON_KEY] = env.value;
  return { SUPABASE_URL, SUPABASE_ANON_KEY };
}
