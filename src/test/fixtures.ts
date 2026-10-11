import type { Movie, MovieDetail } from "../types/tmdb";

export function makeMovie(overrides: Partial<Movie> = {}): Movie {
  return {
    id: 1,
    title: "Inception",
    overview:
      "A thief who steals corporate secrets through dream-sharing technology.",
    poster_path: "/poster.jpg",
    backdrop_path: "/backdrop.jpg",
    release_date: "2010-07-16",
    vote_average: 8.4,
    vote_count: 34000,
    genre_ids: [28, 878],
    ...overrides,
  };
}

export function makeMovieDetail(
  overrides: Partial<MovieDetail> = {},
): MovieDetail {
  return {
    ...makeMovie(),
    runtime: 148,
    tagline: "Your mind is the scene of the crime.",
    status: "Released",
    genres: [
      { id: 28, name: "Action" },
      { id: 878, name: "Science Fiction" },
    ],
    credits: {
      id: 1,
      cast: [
        {
          id: 6193,
          name: "Leonardo DiCaprio",
          character: "Cobb",
          profile_path: "/leo.jpg",
          order: 0,
        },
        {
          id: 24045,
          name: "Joseph Gordon-Levitt",
          character: "Arthur",
          profile_path: null,
          order: 1,
        },
      ],
      crew: [
        {
          id: 525,
          name: "Christopher Nolan",
          job: "Director",
          department: "Directing",
          profile_path: null,
        },
        {
          id: 1160,
          name: "Emma Thomas",
          job: "Producer",
          department: "Production",
          profile_path: null,
        },
      ],
    },
    ...overrides,
  };
}
