import { ENTRY_TYPE } from '../lib/constants';

export * from './bufferSize';
export * from './itemHeight';
export * from './threshold';
export * from './totalItems';

export type VisibleRange = {
  start: number;
  end: number;
};

export type LoadType = (typeof ENTRY_TYPE)[keyof typeof ENTRY_TYPE];

export type WithSequence<T> = T & {
  sequence: number;
};

export type WindowItemChildrenProps<T> = (props: {
  data: T;
  isExpanded: boolean;
  onClick: () => void;
}) => React.ReactNode;

export type WindowItemProps<T> = {
  className?: string;
  style?: React.CSSProperties;
  offset: React.CSSProperties;
  order: number;
  data: T;
  isExpanded: boolean;
  toggleItemExpanded: (index: number) => void;
  updateItemHeight: (index: number, height: number) => void;
  children?: WindowItemChildrenProps<T> | React.ReactNode;
};

export type ReactDynamicWindowControls = {
  scrollToTop: (props: ScrollToOptions) => () => void;
};

export type ReactDynamicWindowProps<T> = {
  className?: string;
  data: T[];
  itemHeight?: number;
  bufferSize?: number;
  threshold?: number;
  hasLatestData?: boolean;
  controls?: ReactDynamicWindowControls;
  onLoadMore?: () => void;
  onLoadLatest?: () => Promise<boolean>;
  children?: WindowItemChildrenProps<T> | React.ReactNode;
};
