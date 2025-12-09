'use client';

import styles from './CreatePost.module.css';
import Avatar from '../Avatar/Avatar';
import Button from '../Button/Button';
import CreatePostForm from '../CreatePostForm/CreatePostForm';
import { type UserInterface, validateUser } from '../../types/post.types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';

function CreatePost() {
  const { t } = useTranslation();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const { isAuth } = useAuth();

  if (!isAuth) {
    return null;
  }
  let currentUser: UserInterface = {
    id: 0,
    username: '',
    description: '',
    lastLogin: '',
    creationDate: '',
    modifiedDate: '',
  };
  try {
    const data = localStorage.getItem('personInfo');
    currentUser = validateUser(data ? JSON.parse(data) : {});
  } catch {
    console.error('invalid current user validation');
  }

  return (
    <>
      <section className={styles.createPost}>
        <Avatar avatarSrc={currentUser.profileImage} className={styles.createPostAvatar} />
        <p>{t('whatsHappening')}</p>
        <Button
          text={t('tellEveryone')}
          className={styles.createPostButton}
          onClick={() => {
            setIsCreatePostOpen((prev) => !prev);
          }}
        />
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
