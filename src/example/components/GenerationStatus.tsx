import styles from './GenerationStatus.module.css';

type GenerationStatusProps = {
  count: number;
};

const GenerationStatus = ({ count }: GenerationStatusProps) => {
  const countClassName = count > 0 ? styles.count : styles.finished;

  return (
    <div className={styles.status}>
      <span className={styles.label}>Auto Generation Remaining:</span>
      <span className={countClassName}>{count}</span>
    </div>
  );
};

export default GenerationStatus;
