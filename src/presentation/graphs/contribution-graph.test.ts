import { describe, expect, it } from "vitest";
import {
  sortContributionsByDate,
  trimContributions,
} from "./contribution-graph";

describe("sortContributionsByDate", () => {
  it("should sort contributions in ascending order by date", () => {
    const contributions = [
      { date: new Date("2023-05-10"), count: 2 },
      { date: new Date("2023-05-08"), count: 5 },
      { date: new Date("2023-05-09"), count: 3 },
    ];
    const sorted = sortContributionsByDate(contributions);
    expect(sorted.map((c) => c.date.getTime())).toEqual([
      new Date("2023-05-08").getTime(),
      new Date("2023-05-09").getTime(),
      new Date("2023-05-10").getTime(),
    ]);
  });

  it("should handle an empty array", () => {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const contributions: any[] = [];
    const sorted = sortContributionsByDate(contributions);
    expect(sorted).toEqual([]);
  });

  it("should not mutate the original array", () => {
    const contributions = [
      { date: new Date("2023-05-10"), count: 2 },
      { date: new Date("2023-05-08"), count: 5 },
    ];
    const original = [...contributions];
    sortContributionsByDate(contributions);
    expect(contributions).toEqual(original);
  });

  it("should handle contributions with the same date", () => {
    const contributions = [
      { date: new Date("2023-05-10"), count: 2 },
      { date: new Date("2023-05-10"), count: 5 },
      { date: new Date("2023-05-09"), count: 3 },
    ];
    const sorted = sortContributionsByDate(contributions);
    expect(sorted[0].date.getTime()).toBe(new Date("2023-05-09").getTime());
    expect(sorted[1].date.getTime()).toBe(new Date("2023-05-10").getTime());
    expect(sorted[2].date.getTime()).toBe(new Date("2023-05-10").getTime());
  });

  it("should return a new array instance", () => {
    const contributions = [
      { date: new Date("2023-05-10"), count: 2 },
      { date: new Date("2023-05-08"), count: 5 },
    ];
    const sorted = sortContributionsByDate(contributions);
    expect(sorted).not.toBe(contributions);
  });

  it("should handle single element array", () => {
    const contributions = [{ date: new Date("2023-05-10"), count: 2 }];
    const sorted = sortContributionsByDate(contributions);
    expect(sorted).toEqual(contributions);
  });
});

describe("trimContributions", () => {
  it("should remove days before the first Sunday", () => {
    // 2023-05-08: Monday, 2023-05-09: Tuesday, 2023-05-10: Wednesday, 2023-05-14: Sunday
    const contributions = [
      { date: new Date("2023-05-08"), count: 1 }, // Monday
      { date: new Date("2023-05-09"), count: 2 }, // Tuesday
      { date: new Date("2023-05-10"), count: 3 }, // Wednesday
      { date: new Date("2023-05-14"), count: 4 }, // Sunday
      { date: new Date("2023-05-15"), count: 5 }, // Monday
    ];
    const trimmed = trimContributions(contributions);
    expect(trimmed).toEqual([
      { date: new Date("2023-05-14"), count: 4 },
      { date: new Date("2023-05-15"), count: 5 },
    ]);
  });

  it("should return the same array if the first date is Sunday", () => {
    const contributions = [
      { date: new Date("2023-05-14"), count: 4 }, // Sunday
      { date: new Date("2023-05-15"), count: 5 }, // Monday
    ];
    const trimmed = trimContributions(contributions);
    expect(trimmed).toEqual(contributions);
  });

  it("should return an empty array if there is no Sunday", () => {
    const contributions = [
      { date: new Date("2023-05-08"), count: 1 }, // Monday
      { date: new Date("2023-05-09"), count: 2 }, // Tuesday
      { date: new Date("2023-05-10"), count: 3 }, // Wednesday
    ];
    const trimmed = trimContributions(contributions);
    expect(trimmed).toEqual(contributions);
  });

  it("should handle empty array", () => {
    const contributions: { date: Date; count: number }[] = [];
    const trimmed = trimContributions(contributions);
    expect(trimmed).toEqual([]);
  });

  it("should not mutate the original array", () => {
    const contributions = [
      { date: new Date("2023-05-08"), count: 1 },
      { date: new Date("2023-05-14"), count: 2 },
    ];
    const original = [...contributions];
    trimContributions(contributions);
    expect(contributions).toEqual(original);
  });

  it("should handle single element array that is Sunday", () => {
    const contributions = [{ date: new Date("2023-05-14"), count: 1 }]; // Sunday
    const trimmed = trimContributions(contributions);
    expect(trimmed).toEqual(contributions);
  });

  it("should handle single element array that is not Sunday", () => {
    const contributions = [{ date: new Date("2023-05-10"), count: 1 }]; // Wednesday
    const trimmed = trimContributions(contributions);
    expect(trimmed).toEqual(contributions);
  });
});
