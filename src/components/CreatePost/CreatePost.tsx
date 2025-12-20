'use client';

import styles from './CreatePost.module.css';
import Avatar from '../Avatar/Avatar';
import Button from '../Button/Button';
import CreatePostForm from '../CreatePostForm/CreatePostForm';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { getMe } from '@/utils/libApi';

function CreatePost() {
  const { t } = useTranslation();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const { isAuth } = useAuth();
  const { data: meData } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
  });
  if (!isAuth) {
    return null;
  }

  return (
    <>
      <section className={styles.createPost}>
        <Avatar avatarSrc={meData?.profileImage} className={styles.createPostAvatar} />
        <p>{t('whatsHappening')}</p>
        <Button
          className={styles.createPostButton}
          onClick={() => {
            setIsCreatePostOpen((prev) => !prev);
          }}
        >
          {t('tellEveryone')}
        </Button>
      </section>
      {isCreatePostOpen ? (
        <CreatePostForm
          closeFunc={() => {
            setIsCreatePostOpen(false);
          }}
        />
      ) : null}
    </>
  );
}

export default CreatePost;
