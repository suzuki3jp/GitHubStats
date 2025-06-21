"use client";

import { Skeleton } from "@/presentation/common/shadcn/skeleton";
import { useContributionDays } from "@/presentation/hooks/useContributionDays";

export function ContributionTotal() {
  const { contributionDays } = useContributionDays();

  return contributionDays ? (
    <div className="font-bold text-2xl">
      {contributionDays.reduce((sum, day) => sum + day.count, 0)}
    </div>
  ) : (
    <Skeleton className="mx-auto h-[30px] w-[100px]" />
  );
}
