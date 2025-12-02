import './CrossSvg.css';

interface CrossPropsInterface {
  className: string;
}

function CrossSvg({ className }: CrossPropsInterface) {
  return (
    <svg
      className={className + ' cross-small-icon'}
      viewBox="0 0 180 180"
      width="50"
      height="50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M135 45L45 135M45 45l90 90" stroke="currentColor" strokeWidth="10" />
    </svg>
  );
}

export default CrossSvg;
