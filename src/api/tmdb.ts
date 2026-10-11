import axios from "axios";
import { BASE_URL } from "../config/env";
import type {
  Movie,
  MovieCategory,
  MovieDetail,
  PaginatedResponse,
} from "../types/tmdb";

export const http = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

export interface FetchMoviesParams {
  category?: MovieCategory;
  query?: string;
  page?: number;
}

const categoryPath = (category: MovieCategory): string => `/movie/${category}`;

export async function fetchMovies({
  category = "popular",
  query,
  page = 1,
}: FetchMoviesParams = {}): Promise<PaginatedResponse<Movie>> {
  const trimmedQuery = query?.trim();

  if (trimmedQuery) {
    const { data } = await http.get<PaginatedResponse<Movie>>("/search/movie", {
      params: { query: trimmedQuery, page },
    });
    return data;
  }

  const { data } = await http.get<PaginatedResponse<Movie>>(
    categoryPath(category),
    { params: { page } },
  );
  return data;
}

export async function fetchMovieDetail(
  id: number | string,
): Promise<MovieDetail> {
  const { data } = await http.get<MovieDetail>(`/movie/${id}`, {
    params: { append_to_response: "credits" },
  });
  return data;
}

export function getDirector(movie: MovieDetail | null): string | null {
  const director = movie?.credits?.crew.find((member) => member.job === "Director");
  return director?.name ?? null;
}

export function getMainCast(movie: MovieDetail | null, limit = 8) {
  return (movie?.credits?.cast ?? [])
    .slice()
    .sort((a, b) => a.order - b.order)
    .slice(0, limit);
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      return "Invalid TMDB API key. Please check your configuration.";
    }
    if (error.response?.status === 404) {
      return "We couldn't find what you were looking for.";
    }
    if (error.code === "ECONNABORTED") {
      return "The request timed out. Please try again.";
    }
    if (!error.response) {
      return "Network error. Please check your internet connection.";
    }
    return `Request failed (${error.response.status}). Please try again.`;
  }
  return "Something went wrong. Please try again.";
}
