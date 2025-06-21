import { ArrowLeft } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Logo } from "@/presentation/common/logo";
import { makeLocalizedHref } from "@/presentation/common/makeLocalizedHref";
import { Button } from "@/presentation/common/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/presentation/common/shadcn/card";
import { ThemeToggle } from "@/presentation/header/theme-toggle";
import { useServerT } from "@/presentation/hooks/t/server";
import { SignInButton } from "@/presentation/sign-in/sign-in-button";

export async function SignIn({ lang }: SignInProps) {
  const { t } = await useServerT(lang, "sign-in");

  const session = await getServerSession();

  if (session) {
    redirect(makeLocalizedHref("/overview", lang));
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-background to-muted px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 left-4">
        <Button variant="ghost" asChild>
          <Link href={makeLocalizedHref("/", lang)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("back-to-home")}
          </Link>
        </Button>
      </div>

      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md gap-0">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <Logo />
          </div>
          <CardTitle className="font-bold text-2xl">{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignInButton lang={lang} />
          <p className="text-center text-muted-foreground text-xs">
            {t("no-store")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

interface SignInProps {
  lang: string;
}
