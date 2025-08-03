"use client";
import { ArcElement, Chart, type ChartData, Legend, Tooltip } from "chart.js";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";

import { useT } from "@/presentation/hooks/t/client";
import { createClient } from "@/supabase/client";
import { getLanguageStats } from "@/usecase/actions/get-language-stats";
import { getUser } from "@/usecase/actions/get-user";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../common/shadcn/card";
import { Skeleton } from "../common/shadcn/skeleton";

type LanguagesUsageProps = {
  languages: Map<string, LanguageUsage>;
};

export type LanguageUsage = {
  color: string;
  lines: number;
};

Chart.register(ArcElement, Tooltip, Legend);

async function getLanguageUsage(): Promise<Map<string, LanguageUsage> | null> {
  const client = await createClient();
  const session = await client.auth.getSession();
  if (!session || !session.data?.session?.provider_token) return null;
  const accessToken = session.data.session.provider_token;

  const user = await getUser(accessToken);

  if (!user || !user.username) return null;
  const username = user.username;

  const languageStats = await getLanguageStats(username, accessToken);
  if (!languageStats) return null;
  const languages = new Map<string, LanguageUsage>();
  // biome-ignore lint/complexity/noForEach: <explanation>
  languageStats.total_languages.forEach((stat) =>
    languages.set(stat.language, {
      color: stat.color,
      lines: stat.lines,
    }),
  );
  return languages;
}

export function LanguageUsageCard({ lang }: { lang: string }) {
  const { t } = useT(lang, "graph");
  const [languages, setLanguages] = useState<Map<string, LanguageUsage> | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLanguageUsage() {
      try {
        const result = await getLanguageUsage();
        setLanguages(result);
      } catch (error) {
        // エラーは静かに処理し、UIでエラー状態を表示
        setLanguages(null);
      } finally {
        setLoading(false);
      }
    }

    fetchLanguageUsage();
  }, []);

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="bg-gradient-to-r from-background to-muted/50">
        <CardTitle className="font-bold text-xl">{t("languageUsage.title")}</CardTitle>
        <CardDescription>
          {t("languageUsage.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative h-[300px]">
          {loading ? (
            <Skeleton className="h-full w-full" />
          ) : languages ? (
            <LanguageUsageGraph languages={languages} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">
                {t("languageUsage.noData")}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function LanguageUsageGraph({ languages }: LanguagesUsageProps) {
  const { theme } = useTheme();

  const data: ChartData<"doughnut", number[], unknown> = {
    labels: Array.from(languages.entries()).map(([name]) => name),
    datasets: [
      {
        data: Array.from(languages.entries()).map(([name]) =>
          linesToPercentage(name, languages),
        ),
        backgroundColor: Array.from(languages.entries()).map(
          ([, usage]) => usage.color,
        ),
        borderColor:
          theme === "dark"
            ? "rgba(30, 30, 30, 0.8)"
            : "rgba(255, 255, 255, 0.8)",
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor:
          theme === "dark"
            ? "rgba(30, 30, 30, 0.8)"
            : "rgba(255, 255, 255, 0.8)",
        titleColor: theme === "dark" ? "#fff" : "#000",
        bodyColor: theme === "dark" ? "#fff" : "#000",
        borderColor:
          theme === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          label: (context: any) => {
            const label = context.label || "";
            const value = context.raw || 0;
            return `${label}: ${value}%`;
          },
        },
      },
    },
    cutout: "65%",
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };

  return (
    <div className="relative flex h-80 w-full items-center justify-center">
      <Doughnut data={data} options={options} />
    </div>
  );
}

function linesToPercentage(
  language: string,
  languages: Map<string, LanguageUsage>,
): number {
  const totalLines = Array.from(languages.values()).reduce(
    (sum, usage) => sum + usage.lines,
    0,
  );
  const languageUsage = languages.get(language);
  if (!languageUsage) return 0;
  return Math.round((languageUsage.lines / totalLines) * 100);
}
