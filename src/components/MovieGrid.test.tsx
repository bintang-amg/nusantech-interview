import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MovieGrid } from "./MovieGrid";
import { renderWithRouter } from "../test/utils";
import { makeMovie } from "../test/fixtures";

describe("MovieGrid", () => {
  it("renders a card for every movie", () => {
    const movies = [
      makeMovie({ id: 1, title: "Movie One" }),
      makeMovie({ id: 2, title: "Movie Two" }),
      makeMovie({ id: 3, title: "Movie Three" }),
    ];

    renderWithRouter(<MovieGrid movies={movies} />);

    expect(screen.getAllByTestId("movie-card")).toHaveLength(3);
    expect(screen.getByText("Movie Two")).toBeInTheDocument();
  });

  it("renders nothing for an empty list", () => {
    const { container } = renderWithRouter(<MovieGrid movies={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
