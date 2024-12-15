import type { WindowItemChildrenProps } from '../types';

export const renderChildren = <T>(
  children: WindowItemChildrenProps<T> | React.ReactNode,
  props: { data: T; isExpanded: boolean; onClick: () => void },
) => {
  return typeof children === 'function' ? children(props) : children;
};
