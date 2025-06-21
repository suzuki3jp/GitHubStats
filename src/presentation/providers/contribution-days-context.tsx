"use client";
import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useState,
} from "react";

import type { ContributionDay } from "@/presentation/graphs/contribution-graph";

export const ContributionDaysContext = createContext<{
  contributionDays: ContributionDay[] | null;
  setContributionDays: Dispatch<SetStateAction<ContributionDay[] | null>>;
}>({
  contributionDays: null,
  setContributionDays: () => {
    throw new Error("setContributionDays function called outside of provider");
  },
});

export function ContributionDaysProvider({
  children,
}: { children: React.ReactNode }) {
  const [contributionDays, setContributionDays] = useState<
    ContributionDay[] | null
  >(null);

  return (
    <ContributionDaysContext.Provider
      value={{
        contributionDays,
        setContributionDays,
      }}
    >
      {children}
    </ContributionDaysContext.Provider>
  );
}
