export type MovieCategory =
  | "now_playing"
  | "popular"
  | "top_rated"
  | "upcoming";

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface MovieCredits {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

export interface MovieDetail extends Movie {
  runtime: number | null;
  tagline: string | null;
  status: string;
  genres: Genre[];
  credits?: MovieCredits;
}

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export type FetchStatus = "idle" | "loading" | "loadingMore" | "success" | "error";
