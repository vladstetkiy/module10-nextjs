import { useState, useEffect } from 'react';
import './PostReactions.css';
import Button from '../Button/Button';
import CommentSvg from '../svg/CommentSvg/CommentSvg';
import LikeSvg from '../svg/LikeSvg/LikeSvg';
import RowSvg from '../svg/RowSvg/RowSvg';
import PenSvg from '../svg/PenSvg/PenSvg';
import Input from '../Input/Input';
import { type CommentInterface, validateComment } from '../../types/post.types';
import libApi from '@/utils/libApi';
import { useTranslation } from 'react-i18next';

interface PostReactionsPropsInterface {
  postId: number;
}

function PostReactions({ postId }: PostReactionsPropsInterface) {
  const { t } = useTranslation();
  const [likes, setLikes] = useState(21);
  const [comments, setComments] = useState<CommentInterface[] | undefined>(undefined);
  const [newComment, setNewComment] = useState('');
  const [isCommentsVisible, setIsCommentsVisible] = useState(true);

  const isAuth = localStorage.getItem('isAuth');

  useEffect(() => {
    libApi
      .get(`/posts/${postId}/comments`)
      .then((data) => {
        return setComments(data.map((i: CommentInterface) => validateComment(i)));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleLike = () => {
    setLikes((prev) => prev + 1);
    libApi.post('/like', {
      postId: postId,
    });
    setNewComment('');
  };

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

    setComments((prev) => {
      if (prev) {
        return [...prev, newCommentObj];
      } else {
        return [newCommentObj];
      }
    });
    libApi.post('/comments', {
      postId: postId,
      text: newComment,
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
      <div className="reactions-count">
        <div className="likes">
          <button onClick={handleLike}>
            <LikeSvg />
          </button>

          <p>
            {likes} {t('likesPlural2')}
          </p>
        </div>
        <div className="comments-count">
          <button>
            <CommentSvg />
          </button>
          {isAuth ? (
            <>
              <p>
                {comments?.length || 0} {t('commentsPlural2')}
              </p>
              <button
                onClick={toggleCommentsVisibility}
                className={isCommentsVisible ? 'comment-svg-visible' : 'comment-svg-invisible'}
              >
                <RowSvg />
              </button>
            </>
          ) : (
            <p>{t('loginToSeeComments')}</p>
          )}
        </div>
      </div>
      {isCommentsVisible && isAuth ? (
        <>
          {' '}
          <div className="comments">
            {comments ? (
              comments.map((comment, index) => (
                <p key={index}>{`#${index + 1}. ` + comment.text}</p>
              ))
            ) : (
              <p>{t('loadingComments')}</p>
            )}
          </div>
          <Input
            wrapperClassName="comment-input-wrapper"
            inputClassName="comment-input"
            placeholder={t('commentPlaceholder')}
            value={newComment}
            onChange={handleICommentInputChange}
            svgIconComponent={<PenSvg />}
            title={t('addComment')}
          />
          <Button
            text={t('addComment')}
            onClick={handleAddComment}
            className="add-comment-button"
          />
        </>
      ) : null}
    </>
  );
}

export default PostReactions;
