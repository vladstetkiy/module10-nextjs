'use client';

import { useAuth } from '@/hooks/useAuth';
import styles from './page.module.css';
import PostSkeleton from '@/components/Post/PostSkeleton';
import CreatePostSkeleton from '@/components/CreatePost/CreatePostSkeleton';
import ListCardSkeleton from '@/components/ListCard/ListCartSkeleton';

export default function HomePage() {
  const { isAuth } = useAuth();

  return (
    <div className={styles.homePage}>
      <main className={styles.main}>
        {isAuth && <CreatePostSkeleton />}
        {[0, 0, 0].map((_, index) => (
          <PostSkeleton key={index} />
        ))}
      </main>
      {isAuth && (
        <aside className={styles.aside}>
          <ListCardSkeleton />
          <ListCardSkeleton />
        </aside>
      )}
    </div>
  );
}
