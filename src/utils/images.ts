import { IMAGE_BASE_URL } from "../config/env";

export const POSTER_SIZE = "w500";
export const BACKDROP_SIZE = "w1280";
export const PROFILE_SIZE = "w185";

export function getImageUrl(
  path: string | null | undefined,
  size: string = POSTER_SIZE,
): string | null {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

export function getPosterUrl(path: string | null | undefined): string | null {
  return getImageUrl(path, POSTER_SIZE);
}

export function getBackdropUrl(path: string | null | undefined): string | null {
  return getImageUrl(path, BACKDROP_SIZE);
}

export function getProfileUrl(path: string | null | undefined): string | null {
  return getImageUrl(path, PROFILE_SIZE);
}
