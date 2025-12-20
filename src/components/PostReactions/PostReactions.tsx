'use client';

import { useState } from 'react';
import styles from './PostReactions.module.css';
import Button from '../Button/Button';
import CommentSvg from '../svg/CommentSvg/CommentSvg';
import LikeSvg from '../svg/LikeSvg/LikeSvg';
import RowSvg from '../svg/RowSvg/RowSvg';
import PenSvg from '../svg/PenSvg/PenSvg';
import Input from '../Input/Input';
import { type CommentInterface, UserInterface, validateComment } from '../../types/post.types';
import libApi from '@/utils/libApi';
import { useTranslation } from 'react-i18next';
import { getPostComments } from '@/utils/libApi';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useNotification } from '@/contexts/NotificationContext/NotificationContext';
import TrashSvg from '../svg/TrashSvg/TrashSvg';

interface PostReactionsPropsInterface {
  postId: number;
  likes: number;
  likedByUsers: UserInterface[];
}

function PostReactions({ postId, likes, likedByUsers }: PostReactionsPropsInterface) {
  const { t } = useTranslation();
  const { isAuth, personInfo } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [isCommentsVisible, setIsCommentsVisible] = useState(true);
  const [likesCount, setLikesCount] = useState(likes);
  const [isLikedByUser, setIsLikedByUser] = useState(() => {
    if (!isAuth) {
      return false;
    }
    if (!likedByUsers.find((item) => item.id === personInfo.id)) {
      return false;
    }
    return true;
  });

  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  const { data: comments } = useQuery({
    queryKey: ['post-comments', postId],
    queryFn: async () => {
      const comments = await getPostComments(postId);
      return comments.map((i: CommentInterface) => validateComment(i));
    },
  });

  const { mutate: addComment } = useMutation({
    mutationFn: (data: CommentInterface) => libApi.post('/comments', data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['post-comments', postId],
      });
    },
    onError: (error) => {
      console.error('Failed to add comment', error);
    },
  });

  const { mutate: deleteComment } = useMutation({
    mutationFn: (commentId: number) => libApi.delete(`/comments/${commentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['post-comments', postId],
      });
    },
    onError: (error) => {
      console.error('Failed to delete comment', error);
    },
  });

  const handleAddComment = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!newComment.trim()) {
      return;
    }
    const newCommentObj: CommentInterface = {
      id: Math.floor(Math.random() * 100),
      text: newComment,
      authorId: personInfo.id,
      postId: postId,
      creationDate: new Date().toISOString(),
      modifiedDate: new Date().toISOString(),
    };

    addComment(newCommentObj);
    showNotification(t('createComment'));
    setNewComment('');
  };

  const handleDeleteComment = (event: React.MouseEvent<HTMLButtonElement>, commentId: number) => {
    event.preventDefault();
    deleteComment(commentId);
    showNotification(t('deleteComment'));
  };

  const handleLike = () => {
    if (isLikedByUser) {
      setLikesCount((prev) => prev - 1);
      setIsLikedByUser(false);
    } else if (isAuth) {
      libApi.post('/like', {
        postId: postId,
      });
      setLikesCount((prev) => prev + 1);
      setNewComment('');
      setIsLikedByUser(true);
    } else {
      showNotification(t('loginToLike'), 5000);
    }
  };

  const handleICommentInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setNewComment(event.target.value);

  const toggleCommentsVisibility = () => {
    setIsCommentsVisible((prev) => !prev);
  };

  return (
    <>
      <div className={styles.reactionsCount}>
        <div className={styles.likes}>
          <Button onClick={handleLike} isStyleDisabled={true}>
            <LikeSvg isActive={isLikedByUser} />
          </Button>

          <p>
            {likesCount} {t('likesPlural2')}
          </p>
        </div>
        <div className={styles.commentsCount}>
          <Button isStyleDisabled={true}>
            <CommentSvg />
          </Button>
          {isAuth ? (
            <>
              <p>
                {comments?.length || 0} {t('commentsPlural2')}
              </p>
              <Button
                onClick={toggleCommentsVisibility}
                className={
                  isCommentsVisible ? styles.commentSvgVisible : styles.commentSvgInvisible
                }
                isStyleDisabled={true}
              >
                <RowSvg />
              </Button>
            </>
          ) : (
            <p>{t('loginToSeeComments')}</p>
          )}
        </div>
      </div>

      <div
        className={`${styles.commentsSection} ${isCommentsVisible && isAuth ? styles.commentsSectionVisible : ''}`}
      >
        <div className={styles.comments}>
          {comments ? (
            comments.map((comment, index) => (
              <div key={index} className={styles.commentWrapper}>
                <p>{`#${index + 1}. ` + comment.text}</p>
                {personInfo.id === comment.authorId ? (
                  <Button
                    isStyleDisabled={true}
                    onClick={(event) => {
                      handleDeleteComment(event, comment.id);
                    }}
                  >
                    <TrashSvg />
                  </Button>
                ) : null}
              </div>
            ))
          ) : (
            <p>{t('loadingComments')}</p>
          )}
        </div>
        <Input
          wrapperClassName={styles.commentInputWrapper}
          inputClassName={styles.commentInput}
          placeholder={t('commentPlaceholder')}
          value={newComment}
          onChange={handleICommentInputChange}
          svgIconComponent={<PenSvg />}
          title={t('addComment')}
        />
        <Button onClick={handleAddComment} className={styles.addCommentButton}>
          {t('addComment')}
        </Button>
      </div>
    </>
  );
}

export default PostReactions;
