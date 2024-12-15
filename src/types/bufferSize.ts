import { BUFFER_SIZE } from '../lib/constants';

export type BufferSize = number & { __brand: 'BufferSize' };

export function isValidBufferSize(value: number): value is BufferSize {
  return (
    Number.isInteger(value) &&
    value >= BUFFER_SIZE.MIN &&
    value <= BUFFER_SIZE.MAX
  );
}

export function createBufferSize(value: number): BufferSize {
  if (!isValidBufferSize(value)) {
    console.error(
      `Buffer size must be an integer between ${BUFFER_SIZE.MIN} and ${BUFFER_SIZE.MAX}`,
    );
  }
  return value as BufferSize;
}
