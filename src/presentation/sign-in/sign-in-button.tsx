"use client";
import { Github } from "lucide-react";

import { makeLocalizedHref } from "@/presentation/common/makeLocalizedHref";
import { Button } from "@/presentation/common/shadcn/button";
import { useT } from "@/presentation/hooks/t/client";

export function SignInButton({ lang }: SignInButtonProps) {
  const { t } = useT(lang, "sign-in");

  function handleOnClick() {
    alert("Sign in is not implemented yet")
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
