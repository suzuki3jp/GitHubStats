import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/presentation/common/logo";
import { Button } from "@/presentation/common/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/presentation/common/shadcn/card";
import { ThemeToggle } from "@/presentation/header/theme-toggle";
import { SignInButton } from "./sign-in-button";

export function SignIn() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-background to-muted px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 left-4">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md gap-0">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <Logo size={32} />
          </div>
          <CardTitle className="font-bold text-2xl">
            Sign in to GitHub Stats
          </CardTitle>
          <CardDescription>
            Connect your GitHub account to start analyzing your repositories
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignInButton />
          <p className="text-center text-muted-foreground text-xs">
            We'll analyze your public repositories to generate insights. Your
            private data remains secure.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
