import { ContributionGraphCard } from "@/presentation/cards/contribution-graph-card";
import { MaxWidthContainer } from "@/presentation/common/max-width-container";
import { MinHeightContainer } from "@/presentation/common/min-height-container";
import type { ContributionDay } from "@/presentation/graphs/contribution-graph";
import { useServerT } from "@/presentation/hooks/t/server";

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
      </MaxWidthContainer>
    </MinHeightContainer>
  );
}

interface DemoProps {
  lang: string;
}
