import { useCallback, useEffect, useState } from "react";
import { fetchMovieDetail, getErrorMessage } from "../api/tmdb";
import type { MovieDetail } from "../types/tmdb";

interface UseMovieDetailResult {
  movie: MovieDetail | null;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

export function useMovieDetail(
  id: number | string | undefined,
): UseMovieDetailResult {
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (id === undefined || id === null || id === "") {
      setError("No movie was selected.");
      setIsLoading(false);
      return;
    }

    let active = true;
    setIsLoading(true);
    setError(null);
    setMovie(null);

    fetchMovieDetail(id)
      .then((data) => {
        if (!active) return;
        setMovie(data);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(getErrorMessage(err));
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, reloadKey]);

  const retry = useCallback(() => setReloadKey((key) => key + 1), []);

  return { movie, isLoading, error, retry };
}
