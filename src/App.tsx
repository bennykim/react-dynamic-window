import styles from './App.module.css';
import Demo from './example/Demo';

export default function App() {
  return (
    <div className={styles.app}>
      <img
        src="/bg_moon.webp"
        alt="image of the moon"
        className={styles.moon}
      />
      <div className={styles.glass}>
        <Demo />
      </div>
    </div>
  );
}
