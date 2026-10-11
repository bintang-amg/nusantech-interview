import { Link, useParams } from "react-router-dom";
import { Layout } from "../components/Layout";
import { CastList } from "../components/CastList";
import { Button } from "../components/ui/Button";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { Spinner } from "../components/ui/Spinner";
import { useMovieDetail } from "../hooks/useMovieDetail";
import { getDirector, getMainCast } from "../api/tmdb";
import { getBackdropUrl, getPosterUrl } from "../utils/images";
import { formatRating, formatRuntime, getReleaseYear } from "../utils/format";

export function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { movie, isLoading, error, retry } = useMovieDetail(id);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-24">
          <Spinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (error || !movie) {
    return (
      <Layout>
        <div className="space-y-6 py-16">
          <ErrorMessage message={error ?? "Movie not found."} onRetry={retry} />
          <div className="flex justify-center">
            <Link to="/">
              <Button variant="secondary">← Back to movies</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const poster = getPosterUrl(movie.poster_path);
  const backdrop = getBackdropUrl(movie.backdrop_path);
  const director = getDirector(movie);
  const cast = getMainCast(movie, 8);
  const year = getReleaseYear(movie.release_date);

  return (
    <Layout>
      <div className="space-y-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-300 hover:text-white"
        >
          ← Back
        </Link>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60">
          {backdrop && (
            <div className="relative h-48 w-full sm:h-64">
              <img
                src={backdrop}
                alt=""
                aria-hidden="true"
                className="h-full w-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
            </div>
          )}

          <div className="grid gap-8 p-6 sm:grid-cols-[220px_1fr]">
            <div className="mx-auto w-44 sm:mx-0 sm:w-full">
              {poster ? (
                <img
                  src={poster}
                  alt={`${movie.title} poster`}
                  className="w-full rounded-xl shadow-lg"
                />
              ) : (
                <div className="flex aspect-[2/3] w-full items-center justify-center rounded-xl bg-slate-800 text-sm text-slate-500">
                  No poster
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-white">{movie.title}</h1>
                {movie.tagline && (
                  <p className="italic text-slate-400">{movie.tagline}</p>
                )}
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
                  <span>{year}</span>
                  <span aria-hidden="true">•</span>
                  <span>{formatRuntime(movie.runtime)}</span>
                  <span aria-hidden="true">•</span>
                  <span className="font-semibold text-amber-400">
                    ★ {formatRating(movie.vote_average)}
                  </span>
                </div>
              </div>

              {movie.genres.length > 0 && (
                <ul role="list" className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <li
                      key={genre.id}
                      className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-200"
                    >
                      {genre.name}
                    </li>
                  ))}
                </ul>
              )}

              <div>
                <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-400">
                  Director
                </h2>
                <p className="text-slate-100">{director ?? "Unknown"}</p>
              </div>

              <div>
                <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-400">
                  Synopsis
                </h2>
                <p className="text-sm leading-relaxed text-slate-200">
                  {movie.overview || "No synopsis available for this movie."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">Main Cast</h2>
          <CastList cast={cast} />
        </section>
      </div>
    </Layout>
  );
}
