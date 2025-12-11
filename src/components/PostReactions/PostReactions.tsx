'use client';

import { useState } from 'react';
import styles from './PostReactions.module.css';
import Button from '../Button/Button';
import CommentSvg from '../svg/CommentSvg/CommentSvg';
import LikeSvg from '../svg/LikeSvg/LikeSvg';
import RowSvg from '../svg/RowSvg/RowSvg';
import PenSvg from '../svg/PenSvg/PenSvg';
import Input from '../Input/Input';
import { type CommentInterface, validateComment } from '../../types/post.types';
import libApi from '@/utils/libApi';
import { useTranslation } from 'react-i18next';
import { getPostComments } from '@/utils/libApi';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

interface PostReactionsPropsInterface {
  postId: number;
  likes: number;
}

function PostReactions({ postId, likes }: PostReactionsPropsInterface) {
  const { t } = useTranslation();

  const [newComment, setNewComment] = useState('');
  const [isCommentsVisible, setIsCommentsVisible] = useState(true);
  const [likesCount, setLikesCount] = useState(likes);
  const queryClient = useQueryClient();
  const isAuth = localStorage.getItem('isAuth');

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

  const handleAddComment = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!newComment.trim()) {
      return;
    }
    const newCommentObj: CommentInterface = {
      id: 1984,
      text: newComment,
      authorId: 1,
      postId: postId,
      creationDate: new Date().toISOString(),
      modifiedDate: new Date().toISOString(),
    };

    addComment(newCommentObj);
  };

  const handleLike = () => {
    setLikesCount((prev) => prev + 1);
    libApi.post('/like', {
      postId: postId,
    });
    setNewComment('');
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
            <LikeSvg />
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
      {isCommentsVisible && isAuth ? (
        <>
          <div className={styles.comments}>
            {comments ? (
              comments.map((comment, index) => (
                <p key={index}>{`#${index + 1}. ` + comment.text}</p>
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
        </>
      ) : null}
    </>
  );
}

export default PostReactions;
