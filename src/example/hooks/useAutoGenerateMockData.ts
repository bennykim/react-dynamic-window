import { useCallback, useEffect, useRef, useState } from 'react';

import { generateMockData } from '../mock/data';
import type { ListItem, MockGeneratorConfig } from '../types';

const DEFAULT_CONFIG: MockGeneratorConfig = {
  maxGenerationCount: 5,
  intervalMs: 5000,
  autoStart: false,
};

export const useAutoGenerateMockData = (
  config: Partial<MockGeneratorConfig> = {},
  onDataGenerated: (newData: ListItem[]) => void,
) => {
  const { maxGenerationCount, intervalMs, autoStart } = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  const [state, setState] = useState({
    count: maxGenerationCount,
    isRunning: autoStart,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const configRef = useRef({ maxGenerationCount, intervalMs });

  useEffect(() => {
    configRef.current = { maxGenerationCount, intervalMs };
  }, [maxGenerationCount, intervalMs]);

  const generateData = useCallback(() => {
    const { maxGenerationCount } = configRef.current;

    setState((prev) => {
      if (prev.count <= 0) return prev;

      const newData = generateMockData(
        maxGenerationCount - prev.count,
        1,
        'New',
      );
      onDataGenerated(newData);

      return {
        ...prev,
        count: prev.count - 1,
        isRunning: prev.count > 1,
      };
    });
  }, [onDataGenerated]);

  const clearCurrentInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startGeneration = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isRunning: prev.count > 0,
    }));
  }, []);

  const stopGeneration = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isRunning: false,
    }));
  }, []);

  const resetGeneration = useCallback(() => {
    setState({
      count: maxGenerationCount,
      isRunning: false,
    });
  }, [maxGenerationCount]);

  useEffect(() => {
    if (state.isRunning && state.count > 0) {
      clearCurrentInterval();
      intervalRef.current = setInterval(
        generateData,
        configRef.current.intervalMs,
      );
      return clearCurrentInterval;
    }

    clearCurrentInterval();
  }, [state.isRunning, state.count, clearCurrentInterval, generateData]);

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      count: maxGenerationCount,
    }));
  }, [maxGenerationCount]);

  return {
    generationCount: state.count,
    isCompleted: state.count === 0,
    isRunning: state.isRunning,
    startGeneration,
    stopGeneration,
    resetGeneration,
  };
};
