import { useCallback, useMemo, useState } from 'react';

import packageJson from '../../package.json';
import type { ReactDynamicWindowControls } from '../types';
import { ReactDynamicWindow } from '../ui';
import {
  ConfigurationPanel,
  ItemContainer,
  ItemContent,
  ItemHeader,
  ScrollToTopButton,
} from './components';
import { useAutoGenerateMockData } from './hooks/useAutoGenerateMockData';
import {
  generateMockData,
  INITIAL_ITEMS,
  INITIAL_WINDOW_CONFIG,
  MAX_ITEMS,
} from './mock/data';
import type { ControlGenerationAction, ListItem } from './types';
// eslint-disable-next-line import/order
import styles from './Demo.module.css';

const VERSION = packageJson.version;

export default function Demo() {
  const [listItems, setListItems] = useState(() =>
    generateMockData(0, INITIAL_ITEMS),
  );
  const [latestItems, setLatestItems] = useState<ListItem[]>([]);
  const [windowConfig, setWindowConfig] = useState(INITIAL_WINDOW_CONFIG);
  const [isGenerating, setIsGenerating] = useState(false);

  const { generationCount, startGeneration, stopGeneration, resetGeneration } =
    useAutoGenerateMockData(
      {
        maxGenerationCount: windowConfig.maxGenerationCount,
        intervalMs: windowConfig.intervalMs,
        autoStart: false,
      },
      (newData) => {
        setLatestItems((prev) => [...newData, ...prev]);
      },
    );

  const handleGenerationControl = (action: ControlGenerationAction) => {
    switch (action) {
      case 'start':
        startGeneration();
        setIsGenerating(true);
        break;
      case 'stop':
        stopGeneration();
        setIsGenerating(false);
        break;
      case 'reset':
        resetGeneration();
        setIsGenerating(false);
        break;
    }
  };

  const handleConfigUpdate = (newConfig: typeof windowConfig) => {
    setWindowConfig(newConfig);
  };

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

    await new Promise((resolve) =>
      setTimeout(resolve, windowConfig.loadMoreDelay),
    );
    setListItems((prev) => [
      ...prev,
      ...generateMockData(prev.length, windowConfig.loadMoreCount),
    ]);

    return true;
  }, [
    listItems.length,
    windowConfig.loadMoreCount,
    windowConfig.loadMoreDelay,
  ]);

  const controls = useMemo<ReactDynamicWindowControls>(
    () => ({
      scrollToTop: () => () => {
        console.log('Scroll to top');
      },
    }),
    [],
  );

  const handleScrollToTop = () => {
    const scrollFn = controls.scrollToTop({
      top: 0,
      behavior: 'smooth',
    });
    scrollFn();
  };

  const wrapItemClick = (onClick: () => void) => () => {
    onClick();
    console.log('Item clicked');
  };

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <a className={styles.home} href="https://rdw.surge.sh">
            React Dynamic Window
          </a>
        </h1>
        <a
          className={styles.version}
          href="https://www.npmjs.com/package/react-dynamic-window"
          target="_blank"
          rel="noopener noreferrer"
        >
          v{VERSION}
        </a>
        <a
          className={styles.link}
          href="https://github.com/bennykim/react-dynamic-window"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </a>
      </div>
      <div className={styles.content}>
        <div className={styles.list}>
          <ReactDynamicWindow
            className={styles.window}
            data={listItems}
            itemHeight={windowConfig.itemHeight}
            bufferSize={windowConfig.bufferSize}
            controls={controls}
            hasLatestData={latestItems.length > 0}
            onLoadLatest={handleLatestLoad}
            onLoadMore={handleLoadMore}
          >
            {({ data: item, isExpanded, onClick }) => (
              <ItemContainer onClick={wrapItemClick(onClick)}>
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
              </ItemContainer>
            )}
          </ReactDynamicWindow>
          <ScrollToTopButton onClick={handleScrollToTop} />
        </div>
        <div className={styles.controls}>
          <ConfigurationPanel
            count={generationCount}
            onUpdateConfig={handleConfigUpdate}
            initialConfig={windowConfig}
            onControlGeneration={handleGenerationControl}
            isGenerating={isGenerating}
          />
        </div>
      </div>
    </section>
  );
}
