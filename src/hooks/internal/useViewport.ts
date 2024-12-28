import { useCallback } from 'react';

import { REACT_DYNAMIC_WINDOW } from '../../lib/constants';
import { VisibleRange } from '../../types';

type UseViewportProps = {
  itemHeights: number[];
  containerRef: React.RefObject<HTMLDivElement>;
  bufferSize: number;
  chageVisibleRange?: (range: VisibleRange) => void;
};

type UseViewportReturn = {
  calculateVisibleRange: () => void;
};

export const useViewport = ({
  itemHeights,
  containerRef,
  bufferSize,
  chageVisibleRange,
}: UseViewportProps): UseViewportReturn => {
  const calculateVisibleRange = useCallback(() => {
    const scrollElement = containerRef.current;
    if (!scrollElement) {
      return REACT_DYNAMIC_WINDOW.INITIAL_RANGE;
    }

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

    const newRange = {
      start: Math.max(0, start - bufferSize),
      end: Math.min(itemHeights.length, end + bufferSize),
    };

    chageVisibleRange?.(newRange);
  }, [itemHeights, bufferSize, containerRef, chageVisibleRange]);

  return {
    calculateVisibleRange,
  };
};
