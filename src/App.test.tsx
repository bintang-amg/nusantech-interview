import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import App from "./App";
import * as tmdb from "./api/tmdb";
import { makeMovie, makeMovieDetail } from "./test/fixtures";

vi.mock("./api/tmdb", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./api/tmdb")>();
  return {
    ...actual,
    fetchMovies: vi.fn(),
    fetchMovieDetail: vi.fn(),
  };
});

const fetchMoviesMock = vi.mocked(tmdb.fetchMovies);
const fetchMovieDetailMock = vi.mocked(tmdb.fetchMovieDetail);

describe("App navigation", () => {
  it("navigates from the movie list to the detail page", async () => {
    fetchMoviesMock.mockResolvedValue({
      page: 1,
      results: [makeMovie({ id: 27205, title: "Inception" })],
      total_pages: 1,
      total_results: 1,
    });
    fetchMovieDetailMock.mockResolvedValue(makeMovieDetail());

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    await userEvent.click(await screen.findByRole("link", { name: /inception/i }));

    expect(
      await screen.findByRole("heading", { name: "Inception", level: 1 }),
    ).toBeInTheDocument();
    expect(fetchMovieDetailMock).toHaveBeenCalledWith("27205");
  });
});
