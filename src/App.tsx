import { Navigate, Route, Routes } from "react-router-dom";
import { MovieListPage } from "./pages/MovieListPage";
import { MovieDetailPage } from "./pages/MovieDetailPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MovieListPage />} />
      <Route path="/movie/:id" element={<MovieDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
