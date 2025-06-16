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

        <ContributionGraphCard
          lang={lang}
          contributions={generateDemoContributions(3)}
        />
      </MaxWidthContainer>
    </MinHeightContainer>
  );
}

interface DemoProps {
  lang: string;
}

function generateDemoContributions(years: number): ContributionDay[] {
  const contributions: ContributionDay[] = [];
  const today = new Date();
  const days = years * 365;
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    contributions.push({
      date,
      count: Math.floor(Math.random() * 10), // Random contributions between 0 and 9
    });
  }
  return contributions;
}
