import { ITEM_HEIGHT } from '../lib/constants';

export type ItemHeight = number & { __brand: 'ItemHeight' };

export function isValidItemHeight(value: number): value is ItemHeight {
  return value >= ITEM_HEIGHT.MIN && value <= ITEM_HEIGHT.MAX;
}

export function createItemHeight(value: number): ItemHeight {
  if (!isValidItemHeight(value)) {
    console.error(
      `Item height must be between ${ITEM_HEIGHT.MIN} and ${ITEM_HEIGHT.MAX}px`,
    );
  }
  return value as ItemHeight;
}
