import { useState, type FormEvent } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search movies...",
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch?.(value);
  };

  const handleClear = () => {
    onChange("");
    onSearch?.("");
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={`flex w-full items-center gap-2 rounded-full border bg-slate-900/80 px-4 py-2 transition-colors ${
        isFocused ? "border-brand" : "border-white/10"
      }`}
    >
      <span aria-hidden="true" className="text-slate-400">
        ⌕
      </span>
      <input
        type="search"
        value={value}
        aria-label="Search movies"
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={handleClear}
          className="rounded-full px-2 text-slate-400 hover:text-white"
        >
          ✕
        </button>
      )}
    </form>
  );
}
