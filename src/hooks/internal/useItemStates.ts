import { useCallback, useMemo, useRef, useState } from 'react';

import { ENTRY_TYPE } from '../../lib/constants';
import { createArrayWithValue } from '../../lib/helpers';
import type { LoadType } from '../../types';

type UseItemStatesProps = {
  totalItems: number;
  itemHeight: number;
  loadType: LoadType;
  onVisibleRangeUpdate: () => void;
};

type UseItemStatesReturn = {
  itemHeights: number[];
  expandedItems: boolean[];
  totalHeight: number;
  getItemOffset: (index: number) => number;
  isItemExpanded: (index: number) => boolean;
  updateItemHeight: (index: number, newHeight: number) => void;
  toggleItemExpanded: (index: number) => void;
  initializeNewItemStates: () => void;
};

export const useItemStates = ({
  totalItems,
  itemHeight,
  loadType,
  onVisibleRangeUpdate,
}: UseItemStatesProps): UseItemStatesReturn => {
  const expandedItemsRef = useRef<boolean[]>(
    createArrayWithValue(totalItems, false),
  );

  const [itemHeights, setItemHeights] = useState<number[]>(() =>
    createArrayWithValue(totalItems, itemHeight),
  );

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

  const updateItemHeight = useCallback(
    (index: number, newHeight: number) => {
      setItemHeights((prev) => {
        const newHeights = [...prev];
        newHeights[index] = newHeight;
        return newHeights;
      });
      onVisibleRangeUpdate();
    },
    [onVisibleRangeUpdate],
  );

  const toggleItemExpanded = useCallback(
    (index: number) => {
      expandedItemsRef.current[index] = !expandedItemsRef.current[index];
      onVisibleRangeUpdate();
    },
    [onVisibleRangeUpdate],
  );

  const initializeNewItemStates = useCallback(() => {
    const initializeItemState = <T>(existingStates: T[], initialState: T) => {
      if (existingStates.length >= totalItems) {
        return existingStates;
      }

      const newStates = createArrayWithValue(
        totalItems - existingStates.length,
        initialState,
      );

      return loadType === ENTRY_TYPE.PREPEND
        ? [...newStates, ...existingStates]
        : [...existingStates, ...newStates];
    };

    setItemHeights((currentHeights) =>
      initializeItemState(currentHeights, itemHeight),
    );

    expandedItemsRef.current = initializeItemState(
      expandedItemsRef.current,
      false,
    );
    /* eslint-disable react-hooks/exhaustive-deps */
    // loadType is excluded from the dependency array since it is only used to determine
    // how to initialize item states and its changes should not trigger callback recreation
  }, [totalItems, itemHeight]);

  return {
    itemHeights,
    expandedItems: expandedItemsRef.current,
    totalHeight,
    getItemOffset,
    isItemExpanded,
    updateItemHeight,
    toggleItemExpanded,
    initializeNewItemStates,
  };
};
