interface RatingBadgeProps {
  rating: number;
  label?: string;
}

export function RatingBadge({ rating, label = "Rating" }: RatingBadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-amber-400"
      aria-label={`${label}: ${rating.toFixed(1)}`}
    >
      <span aria-hidden="true">★</span>
      {rating.toFixed(1)}
    </span>
  );
}
