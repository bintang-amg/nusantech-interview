import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MovieListPage } from "./MovieListPage";
import { renderWithRouter } from "../test/utils";
import * as tmdb from "../api/tmdb";
import { makeMovie } from "../test/fixtures";

vi.mock("../api/tmdb", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../api/tmdb")>();
  return { ...actual, fetchMovies: vi.fn() };
});

const fetchMoviesMock = vi.mocked(tmdb.fetchMovies);

const response = (results: ReturnType<typeof makeMovie>[], totalPages = 1) => ({
  page: 1,
  results,
  total_pages: totalPages,
  total_results: results.length,
});

describe("MovieListPage", () => {
  it("renders movies fetched from the api", async () => {
    fetchMoviesMock.mockResolvedValue(
      response([makeMovie({ id: 1, title: "Inception" })]),
    );

    renderWithRouter(<MovieListPage />);

    expect(await screen.findByText("Inception")).toBeInTheDocument();
    expect(fetchMoviesMock).toHaveBeenCalledWith(
      expect.objectContaining({ category: "popular", page: 1 }),
    );
  });

  it("refetches when a different category is selected", async () => {
    fetchMoviesMock.mockResolvedValue(response([makeMovie()]));

    renderWithRouter(<MovieListPage />);
    await screen.findByTestId("movie-card");

    await userEvent.click(screen.getByRole("tab", { name: "Top Rated" }));

    await waitFor(() =>
      expect(fetchMoviesMock).toHaveBeenLastCalledWith(
        expect.objectContaining({ category: "top_rated" }),
      ),
    );
  });

  it("searches movies by title", async () => {
    fetchMoviesMock.mockImplementation(async (params) => {
      const query = params?.query;
      return response([
        makeMovie({
          id: query ? 99 : 1,
          title: query ? "Dune" : "Inception",
        }),
      ]);
    });

    renderWithRouter(<MovieListPage />);
    await screen.findByText("Inception");

    await userEvent.type(screen.getByRole("searchbox"), "Dune");

    await waitFor(() =>
      expect(fetchMoviesMock).toHaveBeenLastCalledWith(
        expect.objectContaining({ query: "Dune" }),
      ),
    );
    expect(await screen.findByText("Dune")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /results for/i }),
    ).toBeInTheDocument();
  });

  it("loads the next page when Load more is clicked", async () => {
    fetchMoviesMock.mockImplementation(async (params) => {
      const page = params?.page ?? 1;
      return page === 1
        ? response([makeMovie({ id: 1, title: "First Movie" })], 2)
        : { ...response([makeMovie({ id: 2, title: "Second Movie" })], 2), page: 2 };
    });

    renderWithRouter(<MovieListPage />);
    await screen.findByText("First Movie");

    await userEvent.click(screen.getByRole("button", { name: /load more/i }));

    expect(await screen.findByText("Second Movie")).toBeInTheDocument();
    expect(screen.getByText("First Movie")).toBeInTheDocument();
    expect(fetchMoviesMock).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 2 }),
    );
  });

  it("shows an empty state when there are no results", async () => {
    fetchMoviesMock.mockResolvedValue(response([]));

    renderWithRouter(<MovieListPage />);

    expect(await screen.findByText(/no movies found/i)).toBeInTheDocument();
  });

  it("shows an error message when the request fails", async () => {
    fetchMoviesMock.mockRejectedValue({
      isAxiosError: true,
      response: { status: 401 },
    });

    renderWithRouter(<MovieListPage />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /invalid tmdb api key/i,
    );
  });
});
