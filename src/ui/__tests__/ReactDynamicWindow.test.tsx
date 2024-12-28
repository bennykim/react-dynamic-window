import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { ENTRY_TYPE } from '../../lib/constants';
import type {
  ReactDynamicWindowControls,
  ReactDynamicWindowProps,
  WithSequence,
} from '../../types';
import { ReactDynamicWindow } from '../ReactDynamicWindow';

type TestItem = {
  title: string;
  content: string;
};

describe('ReactDynamicWindow Component', () => {
  const createMockData = (length: number): WithSequence<TestItem>[] =>
    Array.from({ length }, (_, index) => ({
      sequence: index,
      title: `Item ${index}`,
      content: `Content ${index}`,
    }));

  const createTestProps = (
    overrides = {},
  ): ReactDynamicWindowProps<WithSequence<TestItem>> => ({
    data: createMockData(100),
    itemHeight: 50,
    bufferSize: 5,
    className: 'test-class',
    onLoadMore: jest.fn(),
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
    it('should render initial data correctly', () => {
      const props = createTestProps();
      render(
        <ReactDynamicWindow {...props}>
          {({ data }) => (
            <div data-testid={`item-${data.sequence}`}>{data.title}</div>
          )}
        </ReactDynamicWindow>,
      );

      expect(screen.getByTestId('item-0')).toBeInTheDocument();
    });
  });

  describe('Scrolling and Data Loading', () => {
    it('should load more data when scrolling near bottom', async () => {
      const onLoadMore = jest.fn();
      const props = createTestProps({ onLoadMore });
      const { container } = render(
        <ReactDynamicWindow {...props}>
          {({ data }) => <div>{data.title}</div>}
        </ReactDynamicWindow>,
      );

      const scrollContainer = container.firstChild as HTMLElement;
      await act(async () => {
        Object.defineProperties(scrollContainer, {
          scrollTop: { value: 4500 },
          clientHeight: { value: 500 },
          scrollHeight: { value: 5000 },
        });

        fireEvent.scroll(scrollContainer);
      });

      expect(onLoadMore).toHaveBeenCalled();
    });

    it('should load latest data when scrolling to top', async () => {
      const onLoadLatest = jest.fn().mockResolvedValue(true);
      const props = createTestProps({
        onLoadLatest,
        hasLatestData: true,
        entryType: ENTRY_TYPE.PREPEND,
      });

      const { container } = render(
        <ReactDynamicWindow {...props}>
          {({ data }) => <div>{data.title}</div>}
        </ReactDynamicWindow>,
      );

      const scrollContainer = container.firstChild as HTMLElement;
      await act(async () => {
        Object.defineProperty(scrollContainer, 'scrollTop', { value: 0 });
        fireEvent.scroll(scrollContainer);
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(onLoadLatest).toHaveBeenCalled();
    });
  });

  describe('Controls', () => {
    it('should handle scroll to top control', () => {
      const mockScrollTo = jest.fn();
      const { container } = render(
        <ReactDynamicWindow {...createTestProps()}>
          {({ data }) => <div>{data.title}</div>}
        </ReactDynamicWindow>,
      );

      Object.defineProperty(container.firstChild, 'scrollTo', {
        value: mockScrollTo,
        writable: true,
        configurable: true,
      });

      const controls: ReactDynamicWindowControls = {
        scrollToTop: (options) => () => {
          (container.firstChild as HTMLElement).scrollTo({
            top: 0,
            behavior: 'auto',
            ...options,
          });
        },
      };

      act(() => {
        const scrollToTopFn = controls.scrollToTop({ behavior: 'smooth' });
        scrollToTopFn();
      });

      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
    });
  });
});
