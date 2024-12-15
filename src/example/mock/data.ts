import { ListItem } from '../types';

export const IMAGE_URL = 'https://picsum.photos/200';
export const MAX_ITEMS = 1000;
export const INITIAL_ITEMS = 100;
export const LOAD_MORE_COUNT = 100;
export const LOAD_MORE_DELAY = 500;

export const generateMockData = (
  startIndex: number,
  count: number,
): ListItem[] =>
  Array.from({ length: count }, (_, i) => ({
    title: `Item ${startIndex + i + 1}`,
    author: `Author ${startIndex + i + 1}`,
    description: `Description for item ${startIndex + i + 1}`,
    content: `This is the expanded content for item ${startIndex + i + 1}.`,
    imageUrl: (startIndex + i) % 3 === 0 ? IMAGE_URL : undefined,
  }));
