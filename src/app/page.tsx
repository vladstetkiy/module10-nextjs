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
import libApi from '@/utils/libApi';

export default function HomePage() {
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const [suggestedPeople, setSuggestedPeople] = useState<UserInterface[]>([]);
  const [interestingGroups, setInterestingGroups] = useState<GroupInterface[]>([]);

  const { isAuth } = useAuth();

  useEffect(() => {
    libApi
      .get('/posts')
      .then((data) => {
        const validatedData = data.map((item: PostInterface) => validatePost(item));
        setPosts(validatedData);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
      });

    if (isAuth) {
      libApi
        .get('/getSuggested')
        .then((data) => {
          setSuggestedPeople(data);
        })
        .catch((error) => {
          console.error('Error fetching suggested people:', error);
        });
      libApi
        .get('/groups')
        .then((data) => {
          setInterestingGroups(data);
        })
        .catch((error) => {
          console.error('Error fetching groups:', error);
        });
    }
  }, []);

  return (
    <div className={styles.homePage}>
      <main className={styles.main}>
        {isAuth && <CreatePost />}
        {posts.length >= 1 && posts.map((item) => <Post key={item.id} {...item} />)}
      </main>
      {isAuth && (
        <aside className={styles.aside}>
          <ListCard title="Suggested people" items={suggestedPeople} />
          <ListCard title="communities you might like" items={interestingGroups} isGroups={true} />
        </aside>
      )}
    </div>
  );
}
