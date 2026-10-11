import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  fetchMovieDetail,
  fetchMovies,
  getDirector,
  getErrorMessage,
  getMainCast,
  http,
} from "./tmdb";
import { makeMovieDetail } from "../test/fixtures";

describe("tmdb api", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches a movie category with the page param", async () => {
    const getSpy = vi
      .spyOn(http, "get")
      .mockResolvedValue({ data: { page: 1, results: [], total_pages: 1, total_results: 0 } });

    await fetchMovies({ category: "top_rated", page: 2 });

    expect(getSpy).toHaveBeenCalledWith("/movie/top_rated", {
      params: { page: 2 },
    });
  });

  it("uses the search endpoint when a query is provided", async () => {
    const getSpy = vi
      .spyOn(http, "get")
      .mockResolvedValue({ data: { page: 1, results: [], total_pages: 1, total_results: 0 } });

    await fetchMovies({ category: "popular", query: "  matrix  ", page: 1 });

    expect(getSpy).toHaveBeenCalledWith("/search/movie", {
      params: { query: "matrix", page: 1 },
    });
  });

  it("appends credits when fetching movie detail", async () => {
    const getSpy = vi
      .spyOn(http, "get")
      .mockResolvedValue({ data: makeMovieDetail() });

    await fetchMovieDetail(42);

    expect(getSpy).toHaveBeenCalledWith("/movie/42", {
      params: { append_to_response: "credits" },
    });
  });

  it("extracts the director and main cast from credits", () => {
    const detail = makeMovieDetail();
    expect(getDirector(detail)).toBe("Christopher Nolan");
    expect(getMainCast(detail, 1)).toHaveLength(1);
    expect(getMainCast(detail)[0].name).toBe("Leonardo DiCaprio");
  });

  it("returns a friendly message for an invalid api key", () => {
    const error = {
      isAxiosError: true,
      response: { status: 401 },
    };
    expect(getErrorMessage(error)).toContain("Invalid TMDB API key");
  });

  it("returns a generic message for unknown errors", () => {
    expect(getErrorMessage(new Error("boom"))).toContain("Something went wrong");
  });
});
