'use client';

import { useEffect, useState } from 'react';
import CreatePost from '@/components/CreatePost/CreatePost';
import Post from '@/components/Post/Post';
import ListCard from '@/components/ListCard/ListCard';
import { useAuth } from '@/hooks/useAuth';
import {
  type PostInterface,
  type GroupInterface,
  type UserInterface,
  validatePost,
} from '@/types/post.types';
import styles from './page.module.css';
import { useTranslation } from 'react-i18next';
import { useApiGet } from '@/utils/libApi';

export default function HomePage() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const [suggestedPeople, setSuggestedPeople] = useState<UserInterface[]>([]);
  const [interestingGroups, setInterestingGroups] = useState<GroupInterface[]>([]);

  const { isAuth } = useAuth();

  const postsQuery = useApiGet<PostInterface[]>('/posts');
  const suggestedQuery = useApiGet<UserInterface[]>('/getSuggested', { enabled: false });
  const groupsQuery = useApiGet<GroupInterface[]>('/groups', { enabled: false });

  useEffect(() => {
    if (postsQuery.data) {
      const validatedData = postsQuery.data.map((item: PostInterface) => validatePost(item));
      setPosts(validatedData);
    }
    if (postsQuery.error) {
      console.error('Error fetching posts:', postsQuery.error);
    }
  }, [postsQuery.data, postsQuery.error]);

  useEffect(() => {
    if (suggestedQuery.data) {
      setSuggestedPeople(suggestedQuery.data);
    }
    if (suggestedQuery.error) {
      console.error('Error fetching suggested people:', suggestedQuery.error);
    }
  }, [suggestedQuery.data, suggestedQuery.error]);

  useEffect(() => {
    if (groupsQuery.data) {
      setInterestingGroups(groupsQuery.data);
    }
    if (groupsQuery.error) {
      console.error('Error fetching groups:', groupsQuery.error);
    }
  }, [groupsQuery.data, groupsQuery.error]);

  useEffect(() => {
    if (isAuth) {
      suggestedQuery.refetch();
      groupsQuery.refetch();
    }
  }, [isAuth]);

  return (
    <div className={styles.homePage}>
      <main className={styles.main}>
        {isAuth && <CreatePost />}
        {posts.length >= 1 && posts.map((item) => <Post key={item.id} {...item} />)}
      </main>
      {isAuth && (
        <aside className={styles.aside}>
          <ListCard title={t('sugPeople')} items={suggestedPeople} />
          <ListCard title={t('sugGroups')} items={interestingGroups} isGroups={true} />
        </aside>
      )}
    </div>
  );
}
