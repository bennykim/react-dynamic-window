import { ITEMS } from '../lib/constants';

export type TotalItems = number & { __brand: 'TotalItems' };

export function isValidTotalItems(value: number): value is TotalItems {
  return Number.isInteger(value) && value >= ITEMS.MIN && value <= ITEMS.MAX;
}

export function createTotalItems(value: number): TotalItems {
  if (!isValidTotalItems(value)) {
    console.error(
      `Total items must be an integer between ${ITEMS.MIN} and ${ITEMS.MAX}`,
    );
  }
  return value as TotalItems;
}
