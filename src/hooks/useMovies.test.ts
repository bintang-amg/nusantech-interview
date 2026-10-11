import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useMovies } from "./useMovies";
import * as tmdb from "../api/tmdb";
import { makeMovie } from "../test/fixtures";
import type { MovieCategory } from "../types/tmdb";

vi.mock("../api/tmdb", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../api/tmdb")>();
  return { ...actual, fetchMovies: vi.fn() };
});

const fetchMoviesMock = vi.mocked(tmdb.fetchMovies);

const pageResponse = (
  results: ReturnType<typeof makeMovie>[],
  totalPages: number,
  page = 1,
) => ({
  page,
  results,
  total_pages: totalPages,
  total_results: results.length,
});

describe("useMovies", () => {
  it("loads the first page on mount", async () => {
    fetchMoviesMock.mockResolvedValue(
      pageResponse([makeMovie({ id: 1, title: "Inception" })], 1),
    );

    const { result } = renderHook(() => useMovies({ category: "popular" }));

    expect(result.current.isInitialLoading).toBe(true);

    await waitFor(() => expect(result.current.status).toBe("success"));

    expect(result.current.movies).toHaveLength(1);
    expect(result.current.movies[0].title).toBe("Inception");
    expect(result.current.hasMore).toBe(false);
    expect(fetchMoviesMock).toHaveBeenCalledWith({
      category: "popular",
      query: "",
      page: 1,
    });
  });

  it("appends results when loadMore is called", async () => {
    fetchMoviesMock
      .mockResolvedValueOnce(
        pageResponse([makeMovie({ id: 1, title: "Page One" })], 2, 1),
      )
      .mockResolvedValueOnce(
        pageResponse([makeMovie({ id: 2, title: "Page Two" })], 2, 2),
      );

    const { result } = renderHook(() => useMovies({ category: "popular" }));
    await waitFor(() => expect(result.current.status).toBe("success"));

    act(() => result.current.loadMore());

    await waitFor(() => expect(result.current.movies).toHaveLength(2));
    expect(result.current.movies[1].title).toBe("Page Two");
    expect(result.current.hasMore).toBe(false);
    expect(fetchMoviesMock).toHaveBeenLastCalledWith({
      category: "popular",
      query: "",
      page: 2,
    });
  });

  it("exposes an error message when the request fails", async () => {
    fetchMoviesMock.mockRejectedValue({
      isAxiosError: true,
      response: { status: 404 },
    });

    const { result } = renderHook(() => useMovies({ category: "popular" }));

    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.error).toMatch(/couldn't find/i);
    expect(result.current.movies).toEqual([]);
  });

  it("refetches and resets when the category changes", async () => {
    fetchMoviesMock.mockResolvedValue(pageResponse([makeMovie()], 1));

    const { result, rerender } = renderHook(
      ({ category }: { category: MovieCategory }) =>
        useMovies({ category }),
      { initialProps: { category: "popular" as MovieCategory } },
    );

    await waitFor(() => expect(result.current.status).toBe("success"));

    rerender({ category: "top_rated" });

    await waitFor(() =>
      expect(fetchMoviesMock).toHaveBeenLastCalledWith({
        category: "top_rated",
        query: "",
        page: 1,
      }),
    );
  });
});
