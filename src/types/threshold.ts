import { THRESHOLD } from '../lib/constants';

export type Threshold = number & { __brand: 'Threshold' };

export function isValidThreshold(value: number): value is Threshold {
  return value >= THRESHOLD.MIN && value <= THRESHOLD.MAX;
}

export function createThreshold(value: number): Threshold {
  if (!isValidThreshold(value)) {
    console.error(
      `Threshold must be between ${THRESHOLD.MIN} and ${THRESHOLD.MAX}`,
    );
  }
  return value as Threshold;
}
