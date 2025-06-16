import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/presentation/common/shadcn/tooltip";
import { useServerT } from "../hooks/t/server";

/**
 * The graph for contributions.
 * Similar to the one on GitHub profile pages.
 */
export async function ContributionGraph({
  contributions,
  lang,
}: ContributionGraphProps) {
  const { t } = await useServerT(lang, "graph");

  const sortedContributions = sortContributionsByDate(contributions);
  const trimmedContributions = trimContributions(sortedContributions);
  const weeks: ContributionDay[][] = [];
  for (let i = 0; i < trimmedContributions.length; i += 7) {
    const week = trimmedContributions.slice(i, i + 7);
    weeks.push(week);
  }

  let tempForMonthLabel = weeks[0][0].date.getMonth() + 1;
  return (
    <div className="overflow-x-auto pb-3">
      <div className="flex">
        <div className="mr-2 flex w-8 flex-col">
          <div className="invisible mb-1 flex h-3 items-center justify-end text-muted-foreground text-xs">
            place holder
          </div>
          {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
            <div
              key={dayIndex}
              className="mb-1 flex h-3 items-center justify-end text-muted-foreground text-xs"
            >
              {/* 日、月、火、水、木、金、土の順で表示し、奇数行のみラベルを表示 */}
              {dayIndex % 2 === 1 ? t(`contribution.weekday.${dayIndex}`) : ""}
            </div>
          ))}
        </div>

        <div>
          <div className="flex">
            {weeks.map((week, idx) => {
              const month = week[0].date.getMonth() + 1;
              const id = week[0].date.toISOString();

              if (idx === 0) {
                return (
                  <div
                    key={id}
                    className="mr-1 w-3 text-center text-muted-foreground text-xs"
                  >
                    {weeks[0][0].date.getFullYear()}
                  </div>
                );
              }

              if (tempForMonthLabel !== month && month !== 1) {
                tempForMonthLabel = month;
                return (
                  <div
                    key={id}
                    className="mr-1 w-3 text-center text-muted-foreground text-xs"
                  >
                    {month}
                  </div>
                );
              }

              if (tempForMonthLabel !== month && month === 1) {
                tempForMonthLabel = month;
                return (
                  <div
                    key={id}
                    className="mr-1 w-3 text-center text-muted-foreground text-xs"
                  >
                    {week[0].date.getFullYear()}
                  </div>
                );
              }

              // If the month is the same as the previous week, return an empty div
              // to maintain the layout without showing the month label again.
              return (
                <div
                  key={id}
                  className="invisible mr-1 w-3 text-center text-xs"
                >
                  {month}
                </div>
              );
            })}
          </div>

          <div className="flex">
            {weeks.map((week) => (
              <div
                key={week[0].date.toISOString()}
                className="mr-1 flex flex-col"
              >
                {week.map((day) => {
                  const level = getContributionLevel(day.count);
                  return (
                    <Tooltip key={day.date.toISOString()}>
                      <TooltipTrigger asChild>
                        <div
                          className={`mb-1 h-3 w-3 cursor-pointer rounded-sm transition-all hover:scale-125 ${
                            level === 0
                              ? "bg-muted"
                              : level === 1
                                ? "bg-green-200 dark:bg-green-900"
                                : level === 2
                                  ? "bg-green-300 dark:bg-green-700"
                                  : level === 3
                                    ? "bg-green-400 dark:bg-green-600"
                                    : "bg-green-500 dark:bg-green-500"
                          }`}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        <div className="font-medium">
                          {day.date.toLocaleDateString(lang)}
                        </div>
                        <div>
                          {t("contribution.count", { count: day.count })}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ContributionGraphProps {
  lang: string;
  contributions: ContributionDay[];
}

export interface ContributionDay {
  date: Date;
  count: number;
}

/**
 * Exports for testing purposes.
 * Sorts contributions by date in ascending order.
 */
export function sortContributionsByDate(
  contributions: ContributionDay[],
): ContributionDay[] {
  return [...contributions].sort((a, b) => a.date.getTime() - b.date.getTime()); // no mutation
}

/**
 * Exports for testing purposes.
 * Trims contributions to remove days before the first Sunday.
 */
export function trimContributions(
  contributions: ContributionDay[],
): ContributionDay[] {
  const firstSundayIndex = contributions.findIndex(
    (day) => day.date.getDay() === 0,
  );
  return firstSundayIndex !== -1
    ? contributions.slice(firstSundayIndex)
    : contributions;
}

function getContributionLevel(count: number) {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 4) return 2;
  if (count <= 6) return 3;
  return 4;
}
