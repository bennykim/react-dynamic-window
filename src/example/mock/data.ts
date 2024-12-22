import type { ListItem } from '../types';

export const IMAGE_URL = 'https://picsum.photos/200';
export const MAX_ITEMS = 500;
export const INITIAL_ITEMS = 50;
export const LOAD_MORE_COUNT = 50;
export const LOAD_MORE_DELAY = 500;

export const INITIAL_WINDOW_CONFIG = {
  itemHeight: 160,
  bufferSize: 4,
  maxGenerationCount: 5,
  intervalMs: 3000,
  loadMoreDelay: 1000,
  loadMoreCount: 10,
};

export const generateMockData = (
  startIndex: number,
  count: number = 1,
  prefix = '',
): ListItem[] =>
  Array.from({ length: count }, (_, i) => ({
    title: `${prefix} Item ${startIndex + i + 1}`.trim(),
    author: `Author ${startIndex + i + 1}`,
    description: `Description for item ${startIndex + i + 1}`,
    content: `This is the expanded content for item ${startIndex + i + 1}.`,
    imageUrl: (startIndex + i) % 3 === 0 ? IMAGE_URL : undefined,
  }));
