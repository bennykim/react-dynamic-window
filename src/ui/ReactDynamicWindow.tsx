import { memo, useCallback, useEffect } from 'react';

import { useReactDynamicWindow, useSequenceData } from '../hooks';
import { ENTRY_TYPE, REACT_DYNAMIC_WINDOW } from '../lib/constants';
import { getItemStyle } from '../lib/helpers';
import { renderChildren } from '../lib/utils';
import { styles } from '../styles';
import { WindowItem } from './components/WindowItem';

import {
  type ReactDynamicWindowProps,
  createBufferSize,
  createItemHeight,
  createThreshold,
  createTotalItems,
} from '../types';

function ReactDynamicWindowComponent<T>({
  className,
  data,
  itemHeight = REACT_DYNAMIC_WINDOW.DEFAULT_ITEM_HEIGHT,
  bufferSize = REACT_DYNAMIC_WINDOW.DEFAULT_BUFFER_SIZE,
  threshold = REACT_DYNAMIC_WINDOW.DEFAULT_THRESHOLD,
  entryType = ENTRY_TYPE.APPEND,
  hasLatestData,
  controls,
  onLoadMore,
  onLoadLatest,
  children,
}: ReactDynamicWindowProps<T>) {
  const visualizedOptions = {
    totalItems: createTotalItems(data.length),
    itemHeight: createItemHeight(itemHeight),
    bufferSize: createBufferSize(bufferSize),
    threshold: createThreshold(threshold),
    entryType,
    hasLatestData,
    onLoadMore,
    onLoadLatest,
  };
  const reactDynamicWindow = useReactDynamicWindow(visualizedOptions);
  const visibleData = useSequenceData(
    data,
    reactDynamicWindow.visibleRange.start,
    reactDynamicWindow.visibleRange.end,
  );

  const handleScroll = useCallback(() => {
    reactDynamicWindow.handleScroll();
  }, [reactDynamicWindow]);

  useEffect(() => {
    if (controls && controls.scrollToTop) {
      controls.scrollToTop = reactDynamicWindow.scrollToTop;
    }
  }, [controls, reactDynamicWindow.scrollToTop]);

  const getListStyle = useCallback(
    () => ({
      ...styles.list,
      height: reactDynamicWindow.totalHeight,
    }),
    [reactDynamicWindow.totalHeight],
  );

  return (
    <div
      ref={reactDynamicWindow.containerRef}
      style={styles.container}
      onScrollCapture={handleScroll}
    >
      <ul style={getListStyle()}>
        {visibleData.map((item, index) => {
          const actualIndex = reactDynamicWindow.visibleRange.start + index;

          return (
            <WindowItem
              key={`item-${item.sequence}`}
              className={className}
              offset={getItemStyle(
                reactDynamicWindow.getItemOffset(actualIndex),
                itemHeight,
              )}
              order={item.sequence}
              data={item}
              isExpanded={reactDynamicWindow.isItemExpanded(actualIndex)}
              updateItemHeight={reactDynamicWindow.updateItemHeight}
              toggleItemExpanded={reactDynamicWindow.toggleItemExpanded}
            >
              {(props) => renderChildren(children, props)}
            </WindowItem>
          );
        })}
      </ul>
    </div>
  );
}

export const ReactDynamicWindow = memo(
  ReactDynamicWindowComponent,
) as typeof ReactDynamicWindowComponent;
