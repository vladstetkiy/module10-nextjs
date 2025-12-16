import styles from './ListCard.module.css';
import Skeleton from '@mui/material/Skeleton';

function ListCardSkeleton() {
  return (
    <div className={styles.listContainer}>
      <Skeleton variant="text" width={150} height={24} className={styles.listContainerTitle} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          width: '100%',
          marginTop: '8px',
        }}
      >
        {[0, 0, 0, 0].map((_, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Skeleton variant="circular" width={48} height={48} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <Skeleton variant="text" width="80%" height={20} />
              <Skeleton variant="text" width="60%" height={16} style={{ marginTop: '4px' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListCardSkeleton;
