import Skeleton from '@mui/material/Skeleton';
import styles from './Post.module.css';

export default function PostSkeleton() {
  return (
    <div className={styles.postSkeleton}>
      <div className={styles.postSkeletonHeader}>
        <Skeleton variant="circular" width={48} height={48} className={styles.postSkeletonAvatar} />
        <div className={styles.postSkeletonAuthor}>
          <Skeleton variant="text" width={120} height={24} />
          <Skeleton variant="text" width={80} height={16} />
        </div>
      </div>
      <Skeleton
        variant="rectangular"
        width="100%"
        height={300}
        className={styles.postSkeletonImage}
      />

      <div className={styles.postSkeletonContent}>
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="90%" height={20} />
        <Skeleton variant="text" width="80%" height={20} />
        <Skeleton variant="text" width="70%" height={20} />
      </div>

      <div className={styles.postSkeletonReactions}>
        <Skeleton variant="rounded" width={60} height={36} />
        <Skeleton variant="rounded" width={80} height={36} />
        <Skeleton variant="rounded" width={60} height={36} />
      </div>
    </div>
  );
}
