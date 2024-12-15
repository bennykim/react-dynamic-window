import { useCallback, useMemo, useState } from 'react';

import type { ReactDynamicWindowControls } from '../types';
import { ReactDynamicWindow } from '../ui';
import { ItemContent, ItemHeader, ScrollToTopButton } from './components';
import {
  generateMockData,
  INITIAL_ITEMS,
  LOAD_MORE_COUNT,
  LOAD_MORE_DELAY,
  MAX_ITEMS,
} from './mock/data';

export default function Demo() {
  const [listItems, setListItems] = useState(() =>
    generateMockData(0, INITIAL_ITEMS),
  );

  const handleLoadMore = useCallback(async () => {
    if (listItems.length >= MAX_ITEMS) {
      return false;
    }

    await new Promise((resolve) => setTimeout(resolve, LOAD_MORE_DELAY));
    setListItems((prev) => [
      ...prev,
      ...generateMockData(prev.length, LOAD_MORE_COUNT),
    ]);

    return true;
  }, [listItems.length]);

  const controls = useMemo<ReactDynamicWindowControls>(
    () => ({
      scrollToTop: () => {
        console.log('Scroll to top');
      },
    }),
    [],
  );

  const wrapItemClick = (onClick: () => void) => () => {
    onClick();
    console.log('Item clicked');
  };

  const handleScrollToTop = () => {
    controls.scrollToTop({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <section className="w-full h-screen p-4">
      <h1 className="mb-4 text-2xl font-bold">Virtualized List Demo</h1>
      <div className="relative h-[calc(100vh-100px)]">
        <ReactDynamicWindow
          className="p-3 bg-gray-200 border border-black cursor-pointer"
          data={listItems}
          itemHeight={160}
          bufferSize={4}
          controls={controls}
          onLoadMore={handleLoadMore}
        >
          {({ data: item, isExpanded, onClick }) => (
            <article onClick={wrapItemClick(onClick)}>
              <ItemHeader
                title={item.title}
                author={item.author}
                description={item.description}
              />
              <ItemContent
                content={item.content}
                url={item.imageUrl}
                isExpanded={isExpanded}
              />
            </article>
          )}
        </ReactDynamicWindow>
        <ScrollToTopButton onClick={handleScrollToTop} />
      </div>
    </section>
  );
}
