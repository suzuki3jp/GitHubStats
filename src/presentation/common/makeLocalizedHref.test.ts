import { describe, expect, it } from "vitest";
import { makeLocalizedHref } from "./makeLocalizedHref";

describe("makeLocalizedHref", () => {
  const lang = "en";
  it("should prepend the language to the path", () => {
    expect(makeLocalizedHref("about", lang)).toBe("/en/about");
  });

  it("should handle paths that already start with a slash", () => {
    expect(makeLocalizedHref("/about", lang)).toBe("/en/about");
  });

  it("should ensure the path starts with a slash", () => {
    expect(makeLocalizedHref("about/contact", lang)).toBe("/en/about/contact");
  });

  it("should handle empty paths correctly", () => {
    expect(makeLocalizedHref("", lang)).toBe("/en/");
  });
});
