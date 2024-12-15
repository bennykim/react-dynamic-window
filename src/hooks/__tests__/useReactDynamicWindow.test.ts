import { act, renderHook } from '@testing-library/react';

import { ENTRY_TYPE } from '../../lib/constants';
import { createThreshold } from '../../types';
import {
  useReactDynamicWindow,
  type UseReactDynamicWindowProps,
} from '../useReactDynamicWindow';

describe('useReactDynamicWindow', () => {
  const mockProps: UseReactDynamicWindowProps = {
    totalItems: 100,
    itemHeight: 50,
    bufferSize: 5,
    threshold: createThreshold(0.9),
    entryType: ENTRY_TYPE.APPEND,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  describe('Initialization', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useReactDynamicWindow(mockProps));

      expect(result.current.totalHeight).toBe(
        mockProps.totalItems * mockProps.itemHeight,
      );
      expect(result.current.itemHeights).toHaveLength(mockProps.totalItems);
      expect(result.current.expandedItems).toHaveLength(mockProps.totalItems);
      expect(result.current.expandedItems.every((item) => item === false)).toBe(
        true,
      );
    });
  });

  describe('Item Height Management', () => {
    it('should update item height correctly', () => {
      const { result } = renderHook(() => useReactDynamicWindow(mockProps));
      const newHeight = 100;
      const index = 5;

      act(() => {
        result.current.updateItemHeight(index, newHeight);
      });

      expect(result.current.itemHeights[index]).toBe(newHeight);
      expect(result.current.totalHeight).toBe(
        mockProps.totalItems * mockProps.itemHeight +
          (newHeight - mockProps.itemHeight),
      );
    });

    it('should calculate item offset correctly', () => {
      const { result } = renderHook(() => useReactDynamicWindow(mockProps));

      act(() => {
        result.current.updateItemHeight(0, 100);
        result.current.updateItemHeight(1, 150);
      });

      expect(result.current.getItemOffset(0)).toBe(0);
      expect(result.current.getItemOffset(1)).toBe(100);
      expect(result.current.getItemOffset(2)).toBe(250);
    });
  });

  describe('Item Expansion Management', () => {
    it('should toggle item expansion correctly', () => {
      const { result } = renderHook(() => useReactDynamicWindow(mockProps));
      const index = 3;

      act(() => {
        result.current.toggleItemExpanded(index);
      });

      expect(result.current.isItemExpanded(index)).toBe(true);

      act(() => {
        result.current.toggleItemExpanded(index);
      });

      expect(result.current.isItemExpanded(index)).toBe(false);
    });
  });

  describe('Scroll Handling', () => {
    it('should call onLoadMore when scrolled near bottom', () => {
      const onLoadMore = jest.fn();
      const { result } = renderHook(() =>
        useReactDynamicWindow({ ...mockProps, onLoadMore }),
      );

      Object.defineProperty(result.current.containerRef, 'current', {
        value: {
          scrollTop: 4500,
          clientHeight: 500,
          scrollHeight: 5000,
          dataset: {},
        },
      });

      act(() => {
        result.current.handleScroll();
      });

      expect(onLoadMore).toHaveBeenCalled();
    });

    it('should not call onLoadMore when not near bottom', () => {
      const onLoadMore = jest.fn();
      const { result } = renderHook(() =>
        useReactDynamicWindow({ ...mockProps, onLoadMore }),
      );

      Object.defineProperty(result.current.containerRef, 'current', {
        value: {
          scrollTop: 0,
          clientHeight: 500,
          scrollHeight: 5000,
          dataset: {},
        },
      });

      act(() => {
        result.current.handleScroll();
      });

      expect(onLoadMore).not.toHaveBeenCalled();
    });
  });

  describe('Data Updates', () => {
    it('should handle append updates correctly', () => {
      const { result, rerender } = renderHook(
        (props) => useReactDynamicWindow(props),
        { initialProps: mockProps },
      );

      const newTotalItems = mockProps.totalItems + 10;

      act(() => {
        rerender({
          ...mockProps,
          totalItems: newTotalItems,
        });
      });

      expect(result.current.itemHeights).toHaveLength(newTotalItems);
      expect(result.current.expandedItems).toHaveLength(newTotalItems);
    });

    it('should handle prepend updates correctly', () => {
      const prependProps = {
        ...mockProps,
        entryType: ENTRY_TYPE.PREPEND,
      };

      const { result, rerender } = renderHook(
        (props) => useReactDynamicWindow(props),
        { initialProps: prependProps },
      );

      const newTotalItems = prependProps.totalItems + 10;

      Object.defineProperty(result.current.containerRef, 'current', {
        value: {
          scrollTop: 100,
          scrollTo: jest.fn(),
        },
      });

      act(() => {
        rerender({
          ...prependProps,
          totalItems: newTotalItems,
        });
      });

      expect(result.current.itemHeights).toHaveLength(newTotalItems);
      expect(result.current.expandedItems).toHaveLength(newTotalItems);
    });
  });

  describe('Scroll To Top', () => {
    it('should handle scrollToTop correctly', () => {
      const { result } = renderHook(() => useReactDynamicWindow(mockProps));
      const scrollToMock = jest.fn();

      Object.defineProperty(result.current.containerRef, 'current', {
        value: {
          scrollTo: scrollToMock,
        },
      });

      act(() => {
        result.current.scrollToTop({ top: 0, behavior: 'smooth' });
      });

      expect(scrollToMock).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
    });
  });
});
