"use client";

import { useContext } from "react";

import { ContributionDaysContext } from "@/presentation/providers/contribution-days-context";

export function useContributionDays() {
  return useContext(ContributionDaysContext);
}
