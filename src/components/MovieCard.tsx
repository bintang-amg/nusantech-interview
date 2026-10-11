import { Link } from "react-router-dom";
import type { Movie } from "../types/tmdb";
import { getPosterUrl } from "../utils/images";
import { getReleaseYear } from "../utils/format";
import { RatingBadge } from "./ui/RatingBadge";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const poster = getPosterUrl(movie.poster_path);
  const year = getReleaseYear(movie.release_date);

  return (
    <article
      data-testid="movie-card"
      className="group overflow-hidden rounded-xl border border-white/10 bg-slate-900/60 transition-transform hover:-translate-y-1 hover:border-white/20"
    >
      <Link
        to={`/movie/${movie.id}`}
        className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-800">
          {poster ? (
            <img
              src={poster}
              alt={`${movie.title} poster`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center px-3 text-center text-sm text-slate-500">
              No poster available
            </div>
          )}
          <div className="absolute right-2 top-2">
            <RatingBadge rating={movie.vote_average} />
          </div>
        </div>
        <div className="space-y-1 p-3">
          <h3 className="line-clamp-2 text-sm font-semibold text-white">
            {movie.title}
          </h3>
          <p className="text-xs text-slate-400">{year}</p>
        </div>
      </Link>
    </article>
  );
}
