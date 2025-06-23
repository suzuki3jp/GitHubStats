import { ContributionGraphCard } from "@/presentation/cards/contribution-graph-card";
import { MaxWidthContainer } from "@/presentation/common/max-width-container";
import { useServerT } from "@/presentation/hooks/t/server";

export async function Overview({ lang }: OverviewProps) {
  const { t } = await useServerT(lang, "overview");

  return (
    <MaxWidthContainer>
      <div className="my-8">
        <h1 className="mb-2 font-bold text-3xl">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <ContributionGraphCard lang={lang} />
    </MaxWidthContainer>
  );
}

interface OverviewProps {
  lang: string;
}
