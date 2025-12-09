import styles from './MetricCard.module.css';

interface MetricCardPropsInterface {
  cardTitle: string;
  cardValue?: string | number;
  valueComment: string;
  className?: string;
}

function MetricCard({
  cardTitle,
  cardValue = 0,
  valueComment,
  className,
}: MetricCardPropsInterface) {
  return (
    <section className={`${styles.metricCard} ${className || ''}`.trim()}>
      <h2 className={styles.metricCardTitle}>{cardTitle}</h2>
      <p className={styles.metricCardValue}>{cardValue}</p>
      <p className={styles.metricCardValueComment}>{valueComment}</p>
    </section>
  );
}

export default MetricCard;
