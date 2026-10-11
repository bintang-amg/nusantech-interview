const DEFAULT_BASE_URL = "/api/tmdb";

export const BASE_URL =
  import.meta.env.VITE_TMDB_BASE_URL ?? DEFAULT_BASE_URL;

export const IMAGE_BASE_URL =
  import.meta.env.VITE_TMDB_IMAGE_BASE_URL ?? "https://image.tmdb.org/t/p";
