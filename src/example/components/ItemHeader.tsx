import { memo } from 'react';

import styles from './ItemHeader.module.css';

type ItemHeaderProps = {
  title: string;
  author?: string;
  description?: string;
  titleLevel?: 1 | 2 | 3 | 4 | 5;
};

const Separator = memo(() => (
  <span className={styles.separator} aria-hidden="true">
    |
  </span>
));

const MetaInfo = memo(({ label, value }: { label: string; value: string }) => (
  <span>
    <span className={styles.label}>{label} </span>
    {value}
  </span>
));

export const ItemHeader = memo(function ItemHeader({
  title,
  author,
  description,
  titleLevel = 3,
}: ItemHeaderProps) {
  const HeadingTag = `h${titleLevel}` as const;

  return (
    <header className={styles.header}>
      <HeadingTag className={styles.title}>{title}</HeadingTag>
      {(author || description) && (
        <div className={styles.meta}>
          {author && <MetaInfo label="Author" value={author} />}
          {author && description && <Separator />}
          {description && <MetaInfo label="@" value={description} />}
        </div>
      )}
    </header>
  );
});
