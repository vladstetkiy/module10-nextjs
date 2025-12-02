import './CreatePost.css';
import Avatar from '../Avatar/Avatar';
import Button from '../Button/Button';
import CreatePostForm from '../CreatePostForm/CreatePostForm';
import { type UserInterface, validateUser } from '../../types/post.types';
import { useState } from 'react';

function CreatePost() {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
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
      <section className="create-post">
        <Avatar avatarSrc={currentUser.profileImage} className="create-post-avatar" />
        <p>What’s happening?</p>
        <Button
          text="Tell everyone"
          className="create-post-button"
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
