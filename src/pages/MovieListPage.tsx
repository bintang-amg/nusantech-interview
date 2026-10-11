import { useMemo, useState } from "react";
import { Layout } from "../components/Layout";
import { CategoryTabs, type CategoryOption } from "../components/CategoryTabs";
import { MovieGrid } from "../components/MovieGrid";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { Spinner } from "../components/ui/Spinner";
import { useDebounce } from "../hooks/useDebounce";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { useMovies } from "../hooks/useMovies";
import type { MovieCategory } from "../types/tmdb";

const CATEGORIES: CategoryOption<MovieCategory>[] = [
  { value: "now_playing", label: "Now Playing" },
  { value: "popular", label: "Popular" },
  { value: "top_rated", label: "Top Rated" },
  { value: "upcoming", label: "Upcoming" },
];

export function MovieListPage() {
  const [category, setCategory] = useState<MovieCategory>("popular");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);

  const {
    movies,
    status,
    error,
    hasMore,
    isInitialLoading,
    isLoadingMore,
    loadMore,
    retry,
  } = useMovies({ category, query: debouncedSearch });

  const isSearching = debouncedSearch.trim().length > 0;

  const sentinelRef = useInfiniteScroll(loadMore, {
    enabled: hasMore && !isInitialLoading && !isLoadingMore,
  });

  const title = useMemo(() => {
    if (isSearching) return `Results for “${debouncedSearch.trim()}”`;
    return CATEGORIES.find((item) => item.value === category)?.label ?? "";
  }, [isSearching, debouncedSearch, category]);

  const renderContent = () => {
    if (isInitialLoading) {
      return (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      );
    }

    if (status === "error" && error) {
      return (
        <div className="py-16">
          <ErrorMessage message={error} onRetry={retry} />
        </div>
      );
    }

    if (movies.length === 0) {
      return (
        <div className="py-16">
          <EmptyState
            title="No movies found"
            description={
              isSearching
                ? "Try a different keyword or check your spelling."
                : "There are no movies to display right now."
            }
          />
        </div>
      );
    }

    return (
      <>
        <MovieGrid movies={movies} />
        <div ref={sentinelRef} aria-hidden="true" className="h-4" />
        <div className="mt-8 flex justify-center">
          {hasMore ? (
            <Button
              variant="secondary"
              size="lg"
              isLoading={isLoadingMore}
              onClick={loadMore}
            >
              {isLoadingMore ? "Loading..." : "Load more"}
            </Button>
          ) : (
            <p className="text-sm text-slate-500">You've reached the end.</p>
          )}
        </div>
      </>
    );
  };

  return (
    <Layout
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      onSearchSubmit={setSearchTerm}
    >
      <section className="space-y-6">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">{title}</h1>
          <CategoryTabs
            categories={CATEGORIES}
            active={category}
            onChange={setCategory}
          />
        </div>
        {renderContent()}
      </section>
    </Layout>
  );
}
