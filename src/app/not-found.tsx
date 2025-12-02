import Error404Svg from '@/components/svg/Error404Svg/Error404Svg';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.error404Page}>
      <Error404Svg className={styles.error404Svg} />
      <p>Page not found</p>
    </div>
  );
}
