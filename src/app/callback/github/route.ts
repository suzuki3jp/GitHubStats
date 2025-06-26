import { NextResponse } from "next/server";

import { createClient } from "@/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const lang = searchParams.get("lang");
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/")) {
    // if "next" is not a relative URL, use the default
    next = "/";
  }

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}${lang ? `/${lang}` : ""}/overview`);
}
