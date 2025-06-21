import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/presentation/common/shadcn/card";
import { ContributionGraph } from "@/presentation/graphs/contribution-graph";
import { useServerT } from "@/presentation/hooks/t/server";
import { ContributionDaysProvider } from "@/presentation/providers/contribution-days-context";
import { ContributionTotal } from "./contribution-total";

export async function ContributionGraphCard({
  lang,
  demo,
}: ContributionGraphCardProps) {
  const { t } = await useServerT(lang, "graph");

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="bg-gradient-to-r from-background to-muted/50">
        <CardTitle className="font-bold text-xl">
          {t("contribution.title")}
        </CardTitle>
        <CardDescription>{t("contribution.description")}</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <ContributionDaysProvider>
          <ContributionGraph lang={lang} demo={demo} />

          <div className="mt-6 flex gap-1">
            <div className="text-muted-foreground text-sm">
              {t("contribution.less")}
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-sm bg-muted" />
              <div className="h-3 w-3 rounded-sm bg-green-200 dark:bg-green-900" />
              <div className="h-3 w-3 rounded-sm bg-green-300 dark:bg-green-700" />
              <div className="h-3 w-3 rounded-sm bg-green-400 dark:bg-green-600" />
              <div className="h-3 w-3 rounded-sm bg-green-500 dark:bg-green-500" />
            </div>
            <div className="text-muted-foreground text-sm">
              {t("contribution.more")}
            </div>
          </div>

          <div className="mt-4 text-center">
            <ContributionTotal />
            <div className="text-muted-foreground text-sm">
              {t("contribution.total")}
            </div>
          </div>
        </ContributionDaysProvider>
      </CardContent>
    </Card>
  );
}

export interface ContributionGraphCardProps {
  lang: string;
  demo?: boolean;
}
