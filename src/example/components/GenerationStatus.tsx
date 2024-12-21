type GenerationStatusProps = {
  count: number;
};

const GenerationStatus = ({ count }: GenerationStatusProps) => {
  const countClassName =
    count > 0 ? 'demo-status-count' : 'demo-status-finished';

  return (
    <div className="demo-status">
      <span className="demo-status-label">Auto Generation Remaining:</span>
      <span className={countClassName}>{count}</span>
    </div>
  );
};

export default GenerationStatus;
