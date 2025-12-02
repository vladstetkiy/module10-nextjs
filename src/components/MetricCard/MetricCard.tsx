import './MetricCard.css';

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
    <section className={'metric-card ' + className}>
      <h2 className="metric-card-title">{cardTitle}</h2>
      <p className="metric-card-value">{cardValue}</p>
      <p className="metric-card-value-comment">{valueComment}</p>
    </section>
  );
}

export default MetricCard;
