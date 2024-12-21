import styles from './ItemContainer.module.css';

type ItemContainerProps = {
  onClick: () => void;
  children: React.ReactNode;
};

export const ItemContainer = ({ onClick, children }: ItemContainerProps) => {
  return (
    <article className={styles.container} onClick={onClick}>
      {children}
    </article>
  );
};
