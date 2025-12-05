import './CreatePost.css';
import Skeleton from '@mui/material/Skeleton';

function CreatePostSkeleton() {
  return (
    <div className="create-post-skeleton">
      <Skeleton variant="circular" width={64} height={64} className="create-post-avatar-skeleton" />
      <Skeleton variant="text" width={200} height={24} className="create-post-text-skeleton" />
      <Skeleton variant="rounded" width={211} height={44} className="create-post-button-skeleton" />
    </div>
  );
}

export default CreatePostSkeleton;
