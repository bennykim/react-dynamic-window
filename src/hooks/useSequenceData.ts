import { useMemo } from 'react';

export function useSequenceData<T>(
  data: T[],
  startIndex: number,
  endIndex: number,
) {
  return useMemo(() => {
    const visibleData = data.slice(startIndex, endIndex);

    return visibleData.map((item, index) => ({
      ...item,
      sequence: startIndex + index,
    }));
  }, [data, startIndex, endIndex]);
}
