import { useEffect, useState } from 'react';

import { generateMockData } from '../mock/data';
import type { ListItem, MockGeneratorConfig } from '../types';

const DEFAULT_CONFIG: MockGeneratorConfig = {
  batchSize: 1,
  maxGenerationCount: 5,
  intervalMs: 5000,
};

export const useAutoGenerateMockData = (
  config: Partial<MockGeneratorConfig> = {},
  onDataGenerated: (newData: ListItem[]) => void,
) => {
  const { batchSize, maxGenerationCount, intervalMs } = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  const [generationCount, setGenerationCount] = useState(maxGenerationCount);

  useEffect(() => {
    const generateData = () => {
      const newData = generateMockData(
        maxGenerationCount - generationCount,
        batchSize,
        'New',
      );

      onDataGenerated(newData);
      setGenerationCount((prev) => prev - 1);
    };

    const intervalId = setInterval(() => {
      if (generationCount > 0) {
        generateData();
      } else {
        clearInterval(intervalId);
      }
    }, intervalMs);

    return () => {
      clearInterval(intervalId);
    };
  }, [batchSize, maxGenerationCount, intervalMs, onDataGenerated]);

  return {
    generationCount,
    isCompleted: generationCount === 0,
  };
};
