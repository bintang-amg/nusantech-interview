import { Link } from "react-router-dom";
import { SearchBar } from "./ui/SearchBar";

interface HeaderProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (value: string) => void;
}

export function Header({
  searchValue,
  onSearchChange,
  onSearchSubmit,
}: HeaderProps) {
  const showSearch =
    onSearchChange !== undefined &&
    onSearchSubmit !== undefined &&
    searchValue !== undefined;

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tight text-brand">
            MOVIE
          </span>
          <span className="text-xl font-light tracking-tight text-white">
            Explorer
          </span>
        </Link>
        {showSearch && (
          <div className="w-full sm:max-w-sm">
            <SearchBar
              value={searchValue}
              onChange={onSearchChange}
              onSearch={onSearchSubmit}
            />
          </div>
        )}
      </div>
    </header>
  );
}
