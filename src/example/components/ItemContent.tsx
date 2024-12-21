import { memo, useState } from 'react';

import styles from './ItemContent.module.css';

type ItemContentProps = {
  url?: string;
  content?: string;
  isExpanded: boolean;
  imageAlt?: string;
  maxExpandedHeight?: string;
};

const Image = memo(function Image({
  url,
  alt,
  onLoad,
}: {
  url: string;
  alt: string;
  onLoad: () => void;
}) {
  return (
    <img
      src={url}
      alt={alt}
      className={styles.image}
      loading="lazy"
      onLoad={onLoad}
    />
  );
});

const LoadingState = memo(function LoadingState({
  enabled,
}: {
  enabled: boolean;
}) {
  return (
    <div className={`${styles.loading} ${!enabled ? styles.hidden : ''}`}>
      Loading...
    </div>
  );
});

export const ItemContent = memo(function ItemContent({
  url,
  content,
  isExpanded,
  imageAlt = 'Content image',
  maxExpandedHeight = '24rem',
}: ItemContentProps) {
  const [isLoading, setIsLoading] = useState(!!url);

  return (
    <div
      className={styles.content}
      style={{ maxHeight: isExpanded ? maxExpandedHeight : '0' }}
    >
      {content && <p className={styles.paragraph}>{content}</p>}
      {url && (
        <>
          <LoadingState enabled={isLoading} />
          <Image url={url} alt={imageAlt} onLoad={() => setIsLoading(false)} />
        </>
      )}
    </div>
  );
});
