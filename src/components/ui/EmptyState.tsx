import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-10 text-center">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {description && <p className="text-sm text-slate-400">{description}</p>}
      {action}
    </div>
  );
}
