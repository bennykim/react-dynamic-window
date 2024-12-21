import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { ENTRY_TYPE, REACT_DYNAMIC_WINDOW } from '../lib/constants';
import { createArrayWithValue, getInitialVisibleRange } from '../lib/helpers';
import type { Threshold } from '../types';

export type VisibleRange = {
  start: number;
  end: number;
};

export type UseReactDynamicWindowProps = {
  totalItems: number;
  itemHeight: number;
  bufferSize: number;
  threshold: Threshold;
  hasLatestData?: boolean;
  onLoadMore?: () => void;
  onLoadLatest?: () => Promise<boolean>;
};

type UseReactDynamicWindowReturn = {
  visibleRange: VisibleRange;
  containerRef: React.RefObject<HTMLDivElement>;
  expandedItems: boolean[];
  totalHeight: number;
  itemHeights: number[];
  handleScroll: () => void;
  getItemOffset: (index: number) => number;
  updateItemHeight: (index: number, newHeight: number) => void;
  toggleItemExpanded: (index: number) => void;
  isItemExpanded: (index: number) => boolean;
  scrollToTop: (options?: ScrollToOptions) => void;
};

export const useReactDynamicWindow = ({
  totalItems,
  itemHeight,
  bufferSize,
  threshold,
  hasLatestData,
  onLoadMore,
  onLoadLatest,
}: UseReactDynamicWindowProps): UseReactDynamicWindowReturn => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);
  const previousTotalRef = useRef(totalItems);
  const scrollTopRef = useRef(0);
  const isManualScrollRef = useRef(false);
  const expandedItemsRef = useRef<boolean[]>(
    createArrayWithValue(totalItems, false),
  );
  const lastLoadTypeRef = useRef<(typeof ENTRY_TYPE)[keyof typeof ENTRY_TYPE]>(
    ENTRY_TYPE.PREPEND,
  );

  const [itemHeights, setItemHeights] = useState<number[]>(() =>
    createArrayWithValue(totalItems, itemHeight),
  );
  const [visibleRange, setVisibleRange] = useState<VisibleRange>(() =>
    getInitialVisibleRange(containerRef, itemHeight, bufferSize, totalItems),
  );

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

    const updateArrays = () => {
      const updateArray = <T>(prev: T[], defaultValue: T) => {
        if (prev.length < totalItems) {
          const newItems = createArrayWithValue(
            totalItems - prev.length,
            defaultValue,
          );
          return lastLoadTypeRef.current === ENTRY_TYPE.PREPEND
            ? [...newItems, ...prev]
            : [...prev, ...newItems];
        }
        return prev;
      };

      setItemHeights((prev) => updateArray(prev, itemHeight));
      expandedItemsRef.current = updateArray(expandedItemsRef.current, false);
    };

    if (
      lastLoadTypeRef.current === ENTRY_TYPE.PREPEND &&
      totalItems > previousTotalRef.current &&
      !isManualScrollRef.current
    ) {
      handlePrependScroll();
    }

    updateArrays();
    previousTotalRef.current = totalItems;
    isLoadingRef.current = false;
  }, [totalItems, itemHeight]);

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
  }, [hasLatestData, onLoadLatest]);

  const totalHeight = useMemo(
    () => itemHeights.reduce((sum, height) => sum + height, 0),
    [itemHeights],
  );

  const getItemOffset = useCallback(
    (index: number) =>
      itemHeights.slice(0, index).reduce((sum, height) => sum + height, 0),
    [itemHeights],
  );

  const isItemExpanded = useCallback(
    (index: number) => expandedItemsRef.current[index],
    [],
  );

  const updateItemHeight = useCallback((index: number, newHeight: number) => {
    setItemHeights((prev) => {
      const newHeights = [...prev];
      newHeights[index] = newHeight;
      return newHeights;
    });
    setVisibleRange((prev) => ({ ...prev }));
  }, []);

  const toggleItemExpanded = useCallback((index: number) => {
    expandedItemsRef.current[index] = !expandedItemsRef.current[index];
    setVisibleRange((prev) => ({ ...prev }));
  }, []);

  const calculateVisibleRangeChunked = useCallback((): VisibleRange => {
    const scrollElement = containerRef.current;

    if (!scrollElement) return REACT_DYNAMIC_WINDOW.INITIAL_RANGE;

    const { scrollTop, clientHeight } = scrollElement;
    const viewportEnd = scrollTop + clientHeight;

    let start = 0;
    let end = 0;
    let accumulatedHeight = 0;
    let prevAccumulatedHeight = 0;

    for (let i = 0; i < itemHeights.length; i++) {
      const currentHeight = itemHeights[i];
      accumulatedHeight += currentHeight;

      const itemTop = prevAccumulatedHeight;
      const itemBottom = accumulatedHeight;
      const isItemVisible =
        (itemTop <= viewportEnd && itemBottom >= scrollTop) ||
        (itemTop <= scrollTop && itemBottom >= viewportEnd);

      if (isItemVisible && start === 0) {
        start = i === 0 || scrollTop <= itemTop ? 0 : i;
      }

      if (itemTop > viewportEnd && end === 0) {
        end = i + 1;
        break;
      }

      prevAccumulatedHeight = accumulatedHeight;
    }

    end = end || itemHeights.length;

    return {
      start: Math.max(0, start - bufferSize),
      end: Math.min(itemHeights.length, end + bufferSize),
    };
  }, [itemHeights, bufferSize]);

  const handleScroll = useCallback(() => {
    const handleInfiniteScroll = async () => {
      const scrollElement = containerRef.current;

      if (!scrollElement || isLoadingRef.current) return;

      const { scrollTop, clientHeight, scrollHeight } = scrollElement;

      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
      const bottomScrollPercentage = Math.round(scrollPercentage * 100) / 100;

      const isScrollingUp = scrollTop < scrollTopRef.current;
      scrollTopRef.current = scrollTop;

      if (onLoadMore && bottomScrollPercentage > threshold) {
        lastLoadTypeRef.current = ENTRY_TYPE.APPEND;
        isLoadingRef.current = true;
        onLoadMore();
        return;
      }

      if (
        onLoadLatest &&
        isScrollingUp &&
        scrollTop / scrollHeight < 1 - threshold
      ) {
        lastLoadTypeRef.current = ENTRY_TYPE.PREPEND;
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

    const newRange = calculateVisibleRangeChunked();
    setVisibleRange(newRange);
    handleInfiniteScroll();
  }, [calculateVisibleRangeChunked, onLoadMore, onLoadLatest, threshold]);

  const scrollToTop = useCallback((scrollOptions?: ScrollToOptions) => {
    const scrollElement = containerRef.current;

    if (scrollElement) {
      isManualScrollRef.current = true;

      const defaultOptions: ScrollToOptions = {
        top: 0,
        behavior: 'auto',
      };
      scrollElement.scrollTo(scrollOptions || defaultOptions);
    }
  }, []);

  return {
    visibleRange,
    containerRef,
    expandedItems: expandedItemsRef.current,
    totalHeight,
    itemHeights,
    handleScroll,
    getItemOffset,
    updateItemHeight,
    toggleItemExpanded,
    isItemExpanded,
    scrollToTop,
  };
};
