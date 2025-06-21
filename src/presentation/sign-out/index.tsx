"use client";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

import { makeLocalizedHref } from "@/presentation/common/makeLocalizedHref";

export function SignOut({ lang }: SignOutProps) {
  useEffect(() => {
    signOut({
      callbackUrl: makeLocalizedHref("/", lang),
    });
  });

  return <div />;
}

interface SignOutProps {
  lang: string;
}
