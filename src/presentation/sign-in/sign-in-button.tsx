"use client";
import { Github } from "lucide-react";

import { Button } from "@/presentation/common/shadcn/button";
import { useT } from "@/presentation/hooks/t/client";
import { createClient } from "@/supabase/client";
import { getBaseUrl } from "@/usecase/actions/get-base-url";

export function SignInButton({ lang }: SignInButtonProps) {
  const { t } = useT(lang, "sign-in");

  async function handleOnClick() {
    const supabase = await createClient();
    const baseUrl = await getBaseUrl();
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        scopes: "read:user repo",
        redirectTo: `${baseUrl}/callback/github?lang=${lang}`,
      },
    });
  }
  return (
    <Button onClick={handleOnClick} className="w-full" size="lg">
      <Github className="mr-2 h-5 w-5" />
      {t("sign-in-with-github")}
    </Button>
  );
}

interface SignInButtonProps {
  lang: string;
}
