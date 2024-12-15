import { memo, useState } from 'react';

import { cn } from '../utils';

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
      className="h-auto rounded-md w-80"
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
    <div
      className={cn('w-full rounded-md h-[300px]', {
        hidden: !enabled,
      })}
    >
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

  const contentClassNames = cn(
    'mt-2 overflow-hidden',
    isExpanded ? `max-h-[${maxExpandedHeight}]` : 'max-h-0',
  );

  return (
    <div className={contentClassNames}>
      {content && <p className="text-sm text-gray-600">{content}</p>}
      {url && (
        <>
          <LoadingState enabled={isLoading} />
          <Image url={url} alt={imageAlt} onLoad={() => setIsLoading(false)} />
        </>
      )}
    </div>
  );
});
