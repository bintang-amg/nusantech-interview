import { useEffect, useRef, type RefObject } from "react";

export function useInfiniteScroll(
  onLoadMore: () => void,
  options: { enabled?: boolean } = {},
): RefObject<HTMLDivElement> {
  const { enabled = true } = options;
  const sentinelRef = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(onLoadMore);
  callbackRef.current = onLoadMore;

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !enabled) return;

    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          callbackRef.current();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled]);

  return sentinelRef;
}
