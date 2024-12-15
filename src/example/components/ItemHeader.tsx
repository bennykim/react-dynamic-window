import { memo } from 'react';

type ItemHeaderProps = {
  title: string;
  author?: string;
  description?: string;
  titleLevel?: 1 | 2 | 3 | 4 | 5;
};

const Separator = memo(() => (
  <span className="text-gray-400" aria-hidden="true">
    |
  </span>
));

const MetaInfo = memo(({ label, value }: { label: string; value: string }) => (
  <span>
    <span className="font-medium">{label} </span>
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
    <header className="space-y-2">
      <HeadingTag className="text-xl font-semibold">{title}</HeadingTag>
      {(author || description) && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {author && <MetaInfo label="Author" value={author} />}
          {author && description && <Separator />}
          {description && <MetaInfo label="@" value={description} />}
        </div>
      )}
    </header>
  );
});
