import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

import { ENTRY_TYPE } from '../../lib/constants';
import type { LoadType, Threshold } from '../../types';

type UseDataLoaderProps = {
  containerRef: React.RefObject<HTMLDivElement>;
  totalItems: number;
  threshold: Threshold;
  itemHeight: number;
  hasLatestData?: boolean;
  isLoadingRef: React.MutableRefObject<boolean>;
  loadTypeRef: React.MutableRefObject<LoadType>;
  onLoadMore?: () => void;
  onLoadLatest?: () => Promise<boolean>;
  onItemsInitialize: () => void;
};

type UseDataLoaderReturn = {
  scrollToTop: (options?: ScrollToOptions) => void;
  handleInfiniteScroll: () => Promise<void>;
};

export const useDataLoader = ({
  containerRef,
  totalItems,
  threshold,
  itemHeight,
  hasLatestData,
  isLoadingRef,
  loadTypeRef,
  onLoadMore,
  onLoadLatest,

  onItemsInitialize,
}: UseDataLoaderProps): UseDataLoaderReturn => {
  const previousTotalRef = useRef(totalItems);
  const scrollTopRef = useRef(0);
  const isManualScrollRef = useRef(false);

  useEffect(() => {
    return () => {
      isManualScrollRef.current = false;
    };
  }, [totalItems]);

  useLayoutEffect(() => {
    const handlePrependScroll = () => {
      const scrollElement = containerRef.current;
      if (!scrollElement) return;

      const currentScrollTop = scrollElement.scrollTop;
      const newItemsCount = totalItems - previousTotalRef.current;
      const heightDiff = newItemsCount * itemHeight;

      scrollElement.scrollTop = currentScrollTop + heightDiff;
    };

    const isPrependScroll =
      loadTypeRef.current === ENTRY_TYPE.PREPEND &&
      previousTotalRef.current < totalItems &&
      !isManualScrollRef.current;
    if (isPrependScroll) {
      handlePrependScroll();
    }

    onItemsInitialize();
    previousTotalRef.current = totalItems;
    isLoadingRef.current = false;
  }, [
    totalItems,
    itemHeight,
    containerRef,
    onItemsInitialize,
    isLoadingRef,
    loadTypeRef,
  ]);

  useEffect(() => {
    const checkTopAndLatestData = async () => {
      const scrollElement = containerRef.current;
      if (!scrollElement || isLoadingRef.current || !onLoadLatest) return;

      const { scrollTop } = scrollElement;
      const isAtTop = scrollTop === 0;

      if (isAtTop && hasLatestData) {
        isLoadingRef.current = true;
        try {
          const hasMoreData = await onLoadLatest();
          if (!hasMoreData) {
            isLoadingRef.current = false;
          }
        } catch (error) {
          isLoadingRef.current = false;
          console.error('Failed to load latest data:', error);
        }
      }
    };

    checkTopAndLatestData();
    /* eslint-disable react-hooks/exhaustive-deps */
    // These refs are excluded from dependencies since their values are modified
    // as a result/outcome of this callback's execution
    // - isLoadingRef: Loading state ref
  }, [containerRef, hasLatestData, onLoadLatest]);

  const handleInfiniteScroll = useCallback(async () => {
    const scrollElement = containerRef.current;
    if (!scrollElement || isLoadingRef.current) return;

    const { scrollTop, clientHeight, scrollHeight } = scrollElement;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
    const bottomScrollPercentage = Math.round(scrollPercentage * 100) / 100;

    const isScrollingUp = scrollTop < scrollTopRef.current;
    scrollTopRef.current = scrollTop;

    if (onLoadMore && bottomScrollPercentage > threshold) {
      loadTypeRef.current = ENTRY_TYPE.APPEND;
      isLoadingRef.current = true;
      onLoadMore();
      return;
    }

    if (
      onLoadLatest &&
      isScrollingUp &&
      scrollTop / scrollHeight < 1 - threshold
    ) {
      loadTypeRef.current = ENTRY_TYPE.PREPEND;
      isLoadingRef.current = true;

      try {
        const hasMoreData = await onLoadLatest();
        if (!hasMoreData) {
          isLoadingRef.current = false;
        }
      } catch (error) {
        isLoadingRef.current = false;
        console.error('Failed to load latest data:', error);
      }
    }
    /* eslint-disable react-hooks/exhaustive-deps */
    // These refs are excluded from dependencies since their values are modified
    // as a result/outcome of this callback's execution
    // - isLoadingRef: Loading state ref
    // - loadTypeRef: Load type ref
  }, [containerRef, threshold, onLoadMore, onLoadLatest]);

  const scrollToTop = useCallback(
    (options?: ScrollToOptions) => {
      const scrollElement = containerRef.current;
      if (scrollElement) {
        isManualScrollRef.current = true;
        scrollElement.scrollTo({
          top: 0,
          behavior: 'auto',
          ...options,
        });
      }
    },
    [containerRef],
  );

  return {
    scrollToTop,
    handleInfiniteScroll,
  };
};
