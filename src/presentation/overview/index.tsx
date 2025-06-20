import { MaxWidthContainer } from "@/presentation/common/max-width-container";
import { useServerT } from "@/presentation/hooks/t/server";
import { ContributionGraphCard } from "../cards/contribution-graph-card";

export async function Overview({ lang }: OverviewProps) {
  const { t } = await useServerT(lang, "overview");

  return (
    <MaxWidthContainer>
      <div className="my-8">
        <h1 className="mb-2 font-bold text-3xl">Your GitHub Analytics</h1>
        <p className="text-muted-foreground">
          Comprehensive insights into your development activity
        </p>
      </div>

      {/* <ContributionGraphCard lang={lang} /> */}
    </MaxWidthContainer>
  );
}

interface OverviewProps {
  lang: string;
}
