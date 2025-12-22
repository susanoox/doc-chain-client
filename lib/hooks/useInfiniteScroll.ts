import { useEffect, useRef, useCallback } from "react";

interface UseInfiniteScrollOptions {
   onLoadMore: () => void;
   hasMore: boolean;
   isLoading: boolean;
   threshold?: number;
}

export const useInfiniteScroll = ({
   onLoadMore,
   hasMore,
   isLoading,
   threshold = 100,
}: UseInfiniteScrollOptions) => {
   const observerRef = useRef<IntersectionObserver | null>(null);
   const loadMoreRef = useRef<HTMLDivElement | null>(null);

   const handleObserver = useCallback(
      (entries: IntersectionObserverEntry[]) => {
         const [entry] = entries;
         if (entry.isIntersecting && hasMore && !isLoading) {
            onLoadMore();
         }
      },
      [hasMore, isLoading, onLoadMore]
   );

   useEffect(() => {
      const element = loadMoreRef.current;
      if (!element) return;

      observerRef.current = new IntersectionObserver(handleObserver, {
         rootMargin: `${threshold}px`,
      });

      observerRef.current.observe(element);

      return () => {
         if (observerRef.current) {
            observerRef.current.disconnect();
         }
      };
   }, [handleObserver, threshold]);

   return loadMoreRef;
};
