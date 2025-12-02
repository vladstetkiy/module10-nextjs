import './Post.css';
import PersonShortInfo from '../PersonShortInfo/PersonShortInfo.tsx';
import PostReactions from '../PostReactions/PostReactions.tsx';
import type { PostInterface } from '../../types/post.types.ts';

function Post({ id, content, image, authorId }: PostInterface) {
  return (
    <section key={id} className="post">
      <PersonShortInfo itemId={authorId} avatarClassName="post-avatar" />
      {image ? <img src={image} className="post-img"></img> : null}

      <div className="post-description">
        <p>{content}</p>
      </div>
      <PostReactions postId={id} />
    </section>
  );
}

export default Post;
