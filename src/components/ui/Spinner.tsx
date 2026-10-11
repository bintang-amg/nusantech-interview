interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
}

const sizeMap = {
  sm: "h-5 w-5 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-4",
};

export function Spinner({ size = "md", label = "Loading" }: SpinnerProps) {
  return (
    <div role="status" className="flex flex-col items-center gap-3 text-slate-300">
      <span
        className={`animate-spin rounded-full border-slate-600 border-t-brand ${sizeMap[size]}`}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
