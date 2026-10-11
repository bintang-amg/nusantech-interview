import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CategoryTabs } from "./CategoryTabs";

const categories = [
  { value: "now_playing", label: "Now Playing" },
  { value: "popular", label: "Popular" },
] as const;

describe("CategoryTabs", () => {
  it("renders all categories and marks the active one", () => {
    render(
      <CategoryTabs
        categories={[...categories]}
        active="popular"
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("tab", { name: "Now Playing" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
    expect(screen.getByRole("tab", { name: "Popular" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("calls onChange with the selected category", async () => {
    const onChange = vi.fn();
    render(
      <CategoryTabs
        categories={[...categories]}
        active="popular"
        onChange={onChange}
      />,
    );

    await userEvent.click(screen.getByRole("tab", { name: "Now Playing" }));

    expect(onChange).toHaveBeenCalledWith("now_playing");
  });
});
