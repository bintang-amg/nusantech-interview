import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { MovieDetailPage } from "./MovieDetailPage";
import * as tmdb from "../api/tmdb";
import { makeMovieDetail } from "../test/fixtures";

vi.mock("../api/tmdb", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../api/tmdb")>();
  return { ...actual, fetchMovieDetail: vi.fn() };
});

const fetchMovieDetailMock = vi.mocked(tmdb.fetchMovieDetail);

function renderDetail(id = "27205") {
  return render(
    <MemoryRouter initialEntries={[`/movie/${id}`]}>
      <Routes>
        <Route path="/movie/:id" element={<MovieDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("MovieDetailPage", () => {
  it("renders detailed movie information", async () => {
    fetchMovieDetailMock.mockResolvedValue(makeMovieDetail());

    renderDetail();

    expect(
      await screen.findByRole("heading", { name: "Inception", level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText(/christopher nolan/i)).toBeInTheDocument();
    expect(
      screen.getByText(/steals corporate secrets/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Leonardo DiCaprio")).toBeInTheDocument();
    expect(fetchMovieDetailMock).toHaveBeenCalledWith("27205");
  });

  it("provides a back link to the movie list", async () => {
    fetchMovieDetailMock.mockResolvedValue(makeMovieDetail());

    renderDetail();

    const back = await screen.findByRole("link", { name: /back/i });
    expect(back).toHaveAttribute("href", "/");
  });

  it("shows an error state when the movie cannot be loaded", async () => {
    fetchMovieDetailMock.mockRejectedValue({
      isAxiosError: true,
      response: { status: 404 },
    });

    renderDetail("999999");

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /couldn't find/i,
    );
  });
});
