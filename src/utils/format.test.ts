import { describe, expect, it } from "vitest";
import { formatRating, formatRuntime, getReleaseYear } from "./format";

describe("format utils", () => {
  it("extracts a 4-digit year from a release date", () => {
    expect(getReleaseYear("2010-07-16")).toBe("2010");
  });

  it("returns TBA for missing or invalid dates", () => {
    expect(getReleaseYear("")).toBe("TBA");
    expect(getReleaseYear(null)).toBe("TBA");
    expect(getReleaseYear("unknown")).toBe("TBA");
  });

  it("formats runtime into hours and minutes", () => {
    expect(formatRuntime(148)).toBe("2h 28m");
    expect(formatRuntime(45)).toBe("45m");
    expect(formatRuntime(0)).toBe("N/A");
    expect(formatRuntime(null)).toBe("N/A");
  });

  it("formats a rating to one decimal place", () => {
    expect(formatRating(8.4)).toBe("8.4");
    expect(formatRating(7)).toBe("7.0");
  });
});
