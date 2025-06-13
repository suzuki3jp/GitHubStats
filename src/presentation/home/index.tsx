import { ChevronRight, Github } from "lucide-react";
import Link from "next/link";
import { Trans } from "react-i18next/TransWithoutContext";

import { makeLocalizedHref } from "@/presentation/common/makeLocalizedHref";
import { MinHeightContainer } from "@/presentation/common/min-height-container";
import { Button } from "@/presentation/common/shadcn/button";
import type { WithT } from "@/typings";

export function Home({ t, lang }: HomeProps) {
  return (
    <MinHeightContainer className="flex flex-col justify-center">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-8 text-center">
            <div className="space-y-6">
              <h1 className="font-bold text-4xl tracking-tight sm:text-6xl md:text-7xl">
                <Trans
                  t={t}
                  i18nKey={"hero.title"}
                  components={{
                    1: (
                      <span className="bg-linear-to-r from-primary to-blue-500 bg-clip-text text-transparent" />
                    ),
                  }}
                />
              </h1>
              <p className="text-muted-foreground text-xl">
                {t("hero.description")}
              </p>
            </div>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" className="group" asChild>
                <Link href={makeLocalizedHref("/sign-in", lang)}>
                  <Github className="mr-2 h-5 w-5" />
                  {t("hero.sign-in")}
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={makeLocalizedHref("/demo", lang)}>
                  {t("hero.view-demo")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MinHeightContainer>
  );
}

interface HomeProps extends WithT {
  lang: string;
}
