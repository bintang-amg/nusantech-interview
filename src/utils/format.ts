export function getReleaseYear(releaseDate?: string | null): string {
  if (!releaseDate) return "TBA";
  const year = releaseDate.slice(0, 4);
  return /^\d{4}$/.test(year) ? year : "TBA";
}

export function formatRuntime(minutes?: number | null): string {
  if (!minutes || minutes <= 0) return "N/A";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
}

export function formatRating(vote?: number | null): string {
  if (vote === undefined || vote === null) return "N/A";
  return vote.toFixed(1);
}

export function formatVoteCount(count?: number | null): string {
  if (!count) return "0";
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return String(count);
}
