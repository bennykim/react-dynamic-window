import { useCallback, useMemo, useState } from 'react';

import type { ReactDynamicWindowControls } from '../types';
import { ReactDynamicWindow } from '../ui';
import { ItemContent, ItemHeader, ScrollToTopButton } from './components';
import { useAutoGenerateMockData } from './hooks/useAutoGenerateMockData';
import {
  generateMockData,
  INITIAL_ITEMS,
  LOAD_MORE_COUNT,
  LOAD_MORE_DELAY,
  MAX_ITEMS,
} from './mock/data';
import type { ListItem } from './types';

import './demo.css';

export default function Demo() {
  const [listItems, setListItems] = useState(() =>
    generateMockData(0, INITIAL_ITEMS),
  );
  const [latestItems, setLatestItems] = useState<ListItem[]>([]);

  const { isCompleted, generationCount } = useAutoGenerateMockData(
    {
      batchSize: 1,
      maxGenerationCount: 5,
      intervalMs: 3000,
    },
    (newData) => {
      setLatestItems((prev) => [...newData, ...prev]);
    },
  );

  const handleLatestLoad = useCallback(async () => {
    if (latestItems.length === 0) {
      return false;
    }

    await new Promise((resolve) => setTimeout(resolve, 0));
    setListItems((prev) => [...latestItems, ...prev]);
    setLatestItems([]);
    return true;
  }, [latestItems]);

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
    <section className="demo-container">
      <h1 className="demo-title">Virtualized List Demo</h1>
      <div className="demo-status-container">
        {isCompleted ? (
          <p className="demo-status status-complete">Generation Complete </p>
        ) : (
          <p className="demo-status">Generating : {generationCount}</p>
        )}
      </div>
      <div className="demo-list-container">
        <ReactDynamicWindow
          className="list-item"
          data={listItems}
          itemHeight={160}
          bufferSize={4}
          controls={controls}
          hasLatestData={latestItems.length > 0}
          onLoadMore={handleLoadMore}
          onLoadLatest={handleLatestLoad}
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
