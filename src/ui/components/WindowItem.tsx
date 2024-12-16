import React, { memo, useCallback, useEffect, useRef } from 'react';

import { renderChildren } from '../../lib/utils';
import type { WindowItemProps } from '../../types';

function WindowItemComponent<T>({
  order,
  className,
  style,
  offset,
  data,
  isExpanded,
  updateItemHeight,
  toggleItemExpanded,
  children,
}: WindowItemProps<T>) {
  const listItemRef = useRef<HTMLLIElement>(null);

  const updateHeight = useCallback(() => {
    if (listItemRef.current) {
      const newHeight = listItemRef.current.scrollHeight;
      updateItemHeight(order, newHeight);
    }
  }, [order, updateItemHeight]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(updateHeight);
    if (listItemRef.current) {
      resizeObserver.observe(listItemRef.current);
    }
    return () => resizeObserver.disconnect();
  }, [updateHeight]);

  const handleItemClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.currentTarget === e.target) {
        toggleItemExpanded(order);
      }
    },
    [order, toggleItemExpanded],
  );

  const handleChildClick = useCallback(() => {
    toggleItemExpanded(order);
  }, [order, toggleItemExpanded]);

  return (
    <li
      ref={listItemRef}
      className={className}
      style={{ ...offset, ...style }}
      onClick={handleItemClick}
    >
      {renderChildren(children, {
        data,
        isExpanded,
        onClick: handleChildClick,
      })}
    </li>
  );
}

export const WindowItem = memo(
  WindowItemComponent,
) as typeof WindowItemComponent;
