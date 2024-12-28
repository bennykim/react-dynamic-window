import { useCallback, useRef, useState } from 'react';

import { ENTRY_TYPE } from '../lib/constants';
import { getInitialVisibleRange } from '../lib/helpers';
import type { LoadType, Threshold, VisibleRange } from '../types';
import { useThrottle } from './common';
import { useDataLoader, useItemStates, useViewport } from './internal';

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
  const loadTypeRef = useRef<LoadType>(ENTRY_TYPE.PREPEND);

  const [visibleRange, setVisibleRange] = useState<VisibleRange>(() =>
    getInitialVisibleRange(containerRef, itemHeight, bufferSize, totalItems),
  );

  const {
    itemHeights,
    expandedItems,
    totalHeight,
    getItemOffset,
    isItemExpanded,
    updateItemHeight,
    toggleItemExpanded,
    initializeNewItemStates,
  } = useItemStates({
    totalItems,
    itemHeight,
    loadType: loadTypeRef.current,
    onVisibleRangeUpdate: () => {
      setVisibleRange((prev) => ({ ...prev }));
    },
  });

  const { calculateVisibleRange } = useViewport({
    itemHeights,
    containerRef,
    bufferSize,
    chageVisibleRange: (updatedRange) => setVisibleRange(updatedRange),
  });

  const { scrollToTop, handleInfiniteScroll } = useDataLoader({
    containerRef,
    totalItems,
    threshold,
    itemHeight,
    hasLatestData,
    isLoadingRef: isLoadingRef,
    loadTypeRef: loadTypeRef,
    onLoadMore,
    onLoadLatest,
    onItemsInitialize: initializeNewItemStates,
  });

  const handleScrollBase = useCallback(() => {
    calculateVisibleRange();
    handleInfiniteScroll();
  }, [calculateVisibleRange, handleInfiniteScroll]);

  const handleScroll = useThrottle(handleScrollBase, 50);

  return {
    visibleRange,
    containerRef,
    expandedItems,
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
