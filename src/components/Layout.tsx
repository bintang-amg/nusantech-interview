import type { ReactNode } from "react";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (value: string) => void;
}

export function Layout({
  children,
  searchValue,
  onSearchChange,
  onSearchSubmit,
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        onSearchSubmit={onSearchSubmit}
      />
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
