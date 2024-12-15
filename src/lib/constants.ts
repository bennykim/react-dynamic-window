export const THRESHOLD = {
  DEFAULT: 0.9,
  MIN: 0.1,
  MAX: 1,
} as const;

export const BUFFER_SIZE = {
  DEFAULT: 4,
  MIN: 1,
  MAX: 20,
} as const;

export const ITEM_HEIGHT = {
  DEFAULT: 150,
  MIN: 10,
  MAX: 1000,
} as const;

export const ITEMS = {
  MIN: 0,
  MAX: 50000,
} as const;

export const RANGE = {
  DEFAULT: { start: 0, end: 4 },
} as const;

export const REACT_DYNAMIC_WINDOW = {
  INITIAL_RANGE: RANGE.DEFAULT,
  DEFAULT_BUFFER_SIZE: BUFFER_SIZE.DEFAULT,
  DEFAULT_THRESHOLD: THRESHOLD.DEFAULT,
  DEFAULT_ITEM_HEIGHT: ITEM_HEIGHT.DEFAULT,
} as const;

export const SCROLL_DIRECTION = {
  UP: 'up',
  DOWN: 'down',
} as const;

export const ENTRY_TYPE = {
  APPEND: 'append',
  PREPEND: 'prepend',
} as const;
