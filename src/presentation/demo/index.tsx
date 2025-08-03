import { ContributionGraphCard } from "@/presentation/cards/contribution-graph-card";
import { MaxWidthContainer } from "@/presentation/common/max-width-container";
import { MinHeightContainer } from "@/presentation/common/min-height-container";
import { useServerT } from "@/presentation/hooks/t/server";
import { LanguageUsageGraph } from "../graphs/language-usage";

export async function Demo({ lang }: DemoProps) {
  const { t } = await useServerT(lang, "demo");

  return (
    <MinHeightContainer>
      <MaxWidthContainer className="py-8">
        <div className="mb-8">
          <h1 className="mb-2 font-bold text-3xl">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>

        <ContributionGraphCard lang={lang} demo />

        <LanguageUsageGraph
          languages={
            new Map([
              ["JavaScript", { color: "#f1e05a", lines: 1000 }],
              ["Python", { color: "#3572A5", lines: 500 }],
            ])
          }
        />
      </MaxWidthContainer>
    </MinHeightContainer>
  );
}

interface DemoProps {
  lang: string;
}
