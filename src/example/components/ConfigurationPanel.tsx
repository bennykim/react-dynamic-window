import { useState } from 'react';

import { INITIAL_WINDOW_CONFIG } from '../mock/data';
import type { ControlGenerationAction } from '../types';
import styles from './ConfigurationPanel.module.css';

type ConfigurationPanelConfig = {
  itemHeight: number;
  bufferSize: number;
  maxGenerationCount: number;
  intervalMs: number;
  loadMoreDelay: number;
  loadMoreCount: number;
};

type ConfigurationPanelProps = {
  count: number;
  onUpdateConfig?: (config: ConfigurationPanelConfig) => void;
  initialConfig?: ConfigurationPanelConfig;
  onControlGeneration?: (action: ControlGenerationAction) => void;
  isGenerating?: boolean;
};

export const ConfigurationPanel = ({
  count,
  onUpdateConfig,
  initialConfig = INITIAL_WINDOW_CONFIG,
  onControlGeneration,
  isGenerating = false,
}: ConfigurationPanelProps) => {
  const [config, setConfig] = useState(initialConfig);

  const handleChange =
    (field: keyof typeof config) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value) || 0;
      const newConfig = { ...config, [field]: value };
      setConfig(newConfig);
      onUpdateConfig?.(newConfig);
    };

  return (
    <div className={styles.container}>
      <h3 className={styles.headline}>Window Config</h3>

      <div className={styles.configItem}>
        <label className={styles.label}>Item Height (px):</label>
        <input
          type="number"
          value={config.itemHeight}
          onChange={handleChange('itemHeight')}
          min={50}
          max={500}
          className={styles.input}
        />
      </div>

      <div className={styles.configItem}>
        <label className={styles.label}>Buffer Size:</label>
        <input
          type="number"
          value={config.bufferSize}
          onChange={handleChange('bufferSize')}
          min={1}
          max={10}
          className={styles.input}
        />
        <p className={styles.description}>
          * Number of items to render outside the visible area (above and below)
        </p>
      </div>

      <div className={styles.divider} />

      <h3 className={styles.headline}>Load More Settings</h3>

      <div className={styles.configItem}>
        <label className={styles.label}>Load More Delay (ms):</label>
        <input
          type="number"
          value={config.loadMoreDelay}
          onChange={handleChange('loadMoreDelay')}
          min={0}
          max={5000}
          step={100}
          className={styles.input}
        />
      </div>

      <div className={styles.configItem}>
        <label className={styles.label}>Load More Count:</label>
        <input
          type="number"
          value={config.loadMoreCount}
          onChange={handleChange('loadMoreCount')}
          min={1}
          max={50}
          className={styles.input}
        />
      </div>

      <div className={styles.divider} />

      <h3 className={styles.headline}>Latest Load Config</h3>

      <div className={styles.configItem}>
        <label className={styles.label}>Max Generation Count:</label>
        <input
          type="number"
          value={config.maxGenerationCount}
          onChange={handleChange('maxGenerationCount')}
          min={1}
          max={20}
          className={styles.input}
        />
      </div>

      <div className={styles.configItem}>
        <label className={styles.label}>Interval (ms):</label>
        <input
          type="number"
          value={config.intervalMs}
          onChange={handleChange('intervalMs')}
          min={1000}
          max={10000}
          step={100}
          className={styles.input}
        />
      </div>

      <div className={styles.status}>
        <span className={styles.label}>Auto Generation Remaining:</span>
        <span className={count > 0 ? styles.count : styles.finished}>
          [{count}]
        </span>
      </div>

      <div className={styles.buttonGroup}>
        {isGenerating ? (
          <button
            onClick={() => onControlGeneration?.('stop')}
            className={`${styles.button} ${styles.stopButton}`}
          >
            Stop
          </button>
        ) : (
          <button
            onClick={() => onControlGeneration?.('start')}
            className={`${styles.button} ${styles.startButton}`}
            disabled={count === 0}
          >
            Start
          </button>
        )}
        <button
          onClick={() => onControlGeneration?.('reset')}
          className={`${styles.button} ${styles.resetButton}`}
        >
          Reset
        </button>
      </div>

      <p className={styles.description}>
        * Auto Generation adds new items to the top, simulating real-time
        updates.
      </p>
    </div>
  );
};
