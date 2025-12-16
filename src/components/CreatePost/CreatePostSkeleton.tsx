import styles from './CreatePost.module.css';
import Skeleton from '@mui/material/Skeleton';

function CreatePostSkeleton() {
  return (
    <div className={styles.createPostSkeleton}>
      <Skeleton
        variant="circular"
        width={64}
        height={64}
        className={styles.createPostAvatarSkeleton}
      />
      <Skeleton variant="text" width={200} height={24} className={styles.createPostTextSkeleton} />
      <Skeleton
        variant="rounded"
        width={211}
        height={44}
        className={styles.createPostButtonSkeleton}
      />
    </div>
  );
}

export default CreatePostSkeleton;
