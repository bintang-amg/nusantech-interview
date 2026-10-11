import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MovieCard } from "./MovieCard";
import { renderWithRouter } from "../test/utils";
import { makeMovie } from "../test/fixtures";

describe("MovieCard", () => {
  it("shows title, release year, poster and a detail link", () => {
    renderWithRouter(
      <MovieCard
        movie={makeMovie({
          id: 27205,
          title: "Inception",
          release_date: "2010-07-16",
        })}
      />,
    );

    expect(screen.getByText("Inception")).toBeInTheDocument();
    expect(screen.getByText("2010")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Inception poster" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/movie/27205");
  });

  it("renders a fallback when there is no poster", () => {
    renderWithRouter(
      <MovieCard movie={makeMovie({ title: "No Poster", poster_path: null })} />,
    );

    expect(screen.getByText(/no poster available/i)).toBeInTheDocument();
  });
});
