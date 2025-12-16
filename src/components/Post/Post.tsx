import styles from './Post.module.css';
import PersonShortInfo from '../PersonShortInfo/PersonShortInfo';
import PostReactions from '../PostReactions/PostReactions';
import type { PostInterface } from '../../types/post.types.ts';
import { IS_STATIC_EXPORT } from '@/utils/config';

function Post({ id, content, image, authorId, likesCount }: PostInterface) {
  return (
    <section key={id} className={styles.post}>
      <PersonShortInfo itemId={authorId} avatarClassName={styles.postAvatar} />
      {image ? (
        <img
          src={(IS_STATIC_EXPORT ? '/module10-nextjs/' : '') + image}
          className={styles.postImg}
        ></img>
      ) : null}

      <div className={styles.postDescription}>
        <p>{content}</p>
      </div>
      <PostReactions postId={id} likes={likesCount} />
    </section>
  );
}

export default Post;
