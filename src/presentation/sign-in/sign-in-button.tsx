"use client";
import { Github } from "lucide-react";
import { signIn } from "next-auth/react";

import { Button } from "@/presentation/common/shadcn/button";

export function SignInButton() {
  function handleOnClick() {
    signIn("github", { callbackUrl: "/" });
  }
  return (
    <Button onClick={handleOnClick} className="w-full" size="lg">
      <Github className="mr-2 h-5 w-5" />
      Sign in with GitHub
    </Button>
  );
}
