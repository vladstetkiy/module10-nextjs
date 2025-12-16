'use client';

import CreatePost from '@/components/CreatePost/CreatePost';
import Post from '@/components/Post/Post';
import ListCard from '@/components/ListCard/ListCard';
import styles from './page.module.css';
import { getGroups, getPosts, getSuggestedPeople } from '@/utils/libApi';
import { useQuery } from '@tanstack/react-query';

export default function HomePage() {
  const { data: posts } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  });

  const { data: suggestedPeople } = useQuery({
    queryKey: ['suggested-people'],
    queryFn: getSuggestedPeople,
  });

  const { data: groups } = useQuery({
    queryKey: ['groups'],
    queryFn: getGroups,
  });

  return (
    <div className={styles.homePage}>
      <main className={styles.main}>
        <CreatePost />
        {posts && posts.map((item) => <Post key={item.id} {...item} />)}
      </main>
      <aside className={styles.aside + ' .aside'}>
        <ListCard title={'sugPeople'} items={suggestedPeople ? suggestedPeople : []} />
        <ListCard title={'sugGroups'} items={groups ? groups : []} isGroups={true} />
      </aside>
    </div>
  );
}
