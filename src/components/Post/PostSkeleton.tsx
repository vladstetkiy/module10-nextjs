import Skeleton from '@mui/material/Skeleton';
import './Post.css';

export default function PostSkeleton() {
  return (
    <div className="post-skeleton">
      <div className="post-skeleton-header">
        <Skeleton variant="circular" width={48} height={48} className="post-skeleton-avatar" />
        <div className="post-skeleton-author">
          <Skeleton variant="text" width={120} height={24} />
          <Skeleton variant="text" width={80} height={16} />
        </div>
      </div>
      <Skeleton variant="rectangular" width="100%" height={300} className="post-skeleton-image" />

      <div className="post-skeleton-content">
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="90%" height={20} />
        <Skeleton variant="text" width="80%" height={20} />
        <Skeleton variant="text" width="70%" height={20} />
      </div>

      <div className="post-skeleton-reactions">
        <Skeleton variant="rounded" width={60} height={36} />
        <Skeleton variant="rounded" width={80} height={36} />
        <Skeleton variant="rounded" width={60} height={36} />
      </div>
    </div>
  );
}
