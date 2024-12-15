import { REACT_DYNAMIC_WINDOW } from '../lib/constants';

export const createArrayWithValue = <T>(length: number, value: T): T[] =>
  new Array(length).fill(value);

export const getItemStyle = (
  offset: number,
  defaultHeight: number = REACT_DYNAMIC_WINDOW.DEFAULT_ITEM_HEIGHT,
) => ({
  position: 'absolute' as const,
  left: 0,
  right: 0,
  top: offset,
  minHeight: `${defaultHeight}px`,
});

export const getInitialVisibleRange = (
  containerRef: React.RefObject<HTMLDivElement>,
  itemHeight: number,
  bufferSize: number,
  totalItems: number,
) => {
  if (typeof window === 'undefined') return REACT_DYNAMIC_WINDOW.INITIAL_RANGE;

  const containerHeight =
    containerRef.current?.clientHeight ?? window.innerHeight;
  const initialVisibleCount = Math.max(
    1,
    Math.ceil(containerHeight / itemHeight),
  );

  return {
    start: 0,
    end: Math.min(initialVisibleCount + bufferSize, totalItems),
  };
};
