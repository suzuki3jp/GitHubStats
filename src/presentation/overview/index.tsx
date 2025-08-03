import { ContributionGraphCard } from "@/presentation/cards/contribution-graph-card";
import { MaxWidthContainer } from "@/presentation/common/max-width-container";
import { useServerT } from "@/presentation/hooks/t/server";
import { MinHeightContainer } from "../common/min-height-container";
import { LanguageUsageCard } from "../graphs/language-usage";

export async function Overview({ lang }: OverviewProps) {
  const { t } = await useServerT(lang, "overview");

  return (
    <MaxWidthContainer>
      <MinHeightContainer className="my-8 space-y-4">
        <h1 className="mb-2 font-bold text-3xl">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>

        <div className="space-y-6">
          <ContributionGraphCard lang={lang} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <LanguageUsageCard lang={lang} />
          </div>
        </div>
      </MinHeightContainer>
    </MaxWidthContainer>
  );
}

interface OverviewProps {
  lang: string;
}
