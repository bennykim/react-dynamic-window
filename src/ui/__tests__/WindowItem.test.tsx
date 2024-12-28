import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import type { WindowItemProps, WithSequence } from '../../types';
import { WindowItem } from '../components/WindowItem';

interface TestItem {
  title: string;
  content: string;
}

describe('WindowItem Component', () => {
  const createTestProps = (
    overrides = {},
  ): WindowItemProps<WithSequence<TestItem>> => ({
    order: 1,
    className: 'test-class',
    style: {},
    offset: { transform: 'translateY(100px)' },
    data: {
      sequence: 1,
      title: 'Test Item',
      content: 'Test Content',
    },
    isExpanded: false,
    updateItemHeight: jest.fn(),
    toggleItemExpanded: jest.fn(),
    ...overrides,
  });

  const setupTestEnvironment = () => {
    jest.clearAllMocks();

    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));

    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      value: 50,
    });
  };

  beforeEach(setupTestEnvironment);

  describe('Rendering', () => {
    it('should render with provided props and styling', () => {
      const props = createTestProps();
      const { container } = render(
        <WindowItem {...props}>
          {({ data }) => <div>{data.title}</div>}
        </WindowItem>,
      );

      const listItem = container.querySelector('li');
      expect(listItem).toHaveClass('test-class');
      expect(listItem?.style.transform).toBe('translateY(100px)');
    });
  });

  describe('Interactions', () => {
    it('should handle click events and toggle expansion', () => {
      const props = createTestProps();
      const { container } = render(
        <WindowItem {...props}>
          {({ data, onClick }) => (
            <div data-testid="content" onClick={onClick}>
              {data.title}
            </div>
          )}
        </WindowItem>,
      );

      const listItem = container.querySelector('li');
      fireEvent.click(listItem!);
      expect(props.toggleItemExpanded).toHaveBeenCalledWith(props.order);
    });
  });
});
