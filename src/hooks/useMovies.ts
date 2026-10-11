import { useCallback, useEffect, useRef, useState } from "react";
import { fetchMovies, getErrorMessage } from "../api/tmdb";
import type { FetchStatus, Movie, MovieCategory } from "../types/tmdb";

interface UseMoviesOptions {
  category?: MovieCategory;
  query?: string;
}

interface UseMoviesResult {
  movies: Movie[];
  status: FetchStatus;
  error: string | null;
  page: number;
  totalPages: number;
  hasMore: boolean;
  isInitialLoading: boolean;
  isLoadingMore: boolean;
  loadMore: () => void;
  retry: () => void;
}

export function useMovies({
  category = "popular",
  query = "",
}: UseMoviesOptions = {}): UseMoviesResult {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [status, setStatus] = useState<FetchStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);

  const requestIdRef = useRef(0);

  const normalizedQuery = query.trim();

  const loadPage = useCallback(
    (targetPage: number) =>
      fetchMovies({ category, query: normalizedQuery, page: targetPage }),
    [category, normalizedQuery],
  );

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    let active = true;

    setStatus("loading");
    setError(null);
    setMovies([]);
    setPage(1);

    loadPage(1)
      .then((response) => {
        if (!active || requestId !== requestIdRef.current) return;
        setMovies(response.results);
        setTotalPages(response.total_pages);
        setStatus("success");
      })
      .catch((err) => {
        if (!active || requestId !== requestIdRef.current) return;
        setError(getErrorMessage(err));
        setStatus("error");
      });

    return () => {
      active = false;
    };
  }, [loadPage, reloadKey]);

  const loadMore = useCallback(() => {
    if (status === "loading" || status === "loadingMore" || status === "error") {
      return;
    }
    if (page >= totalPages) return;

    const requestId = requestIdRef.current;
    const nextPage = page + 1;
    setStatus("loadingMore");

    loadPage(nextPage)
      .then((response) => {
        if (requestId !== requestIdRef.current) return;
        setMovies((prev) => [...prev, ...response.results]);
        setPage(nextPage);
        setTotalPages(response.total_pages);
        setStatus("success");
      })
      .catch((err) => {
        if (requestId !== requestIdRef.current) return;
        setError(getErrorMessage(err));
        setStatus("error");
      });
  }, [status, page, totalPages, loadPage]);

  const retry = useCallback(() => setReloadKey((key) => key + 1), []);

  return {
    movies,
    status,
    error,
    page,
    totalPages,
    hasMore: page < totalPages,
    isInitialLoading: status === "loading",
    isLoadingMore: status === "loadingMore",
    loadMore,
    retry,
  };
}
