import './Avatar.css';

export interface AvatarPropsInterface {
  avatarSrc?: string;
  className?: string;
}

function Avatar({ avatarSrc, className }: AvatarPropsInterface) {
  return <img src={avatarSrc} alt="avatar" className={className + ' avatar'} />;
}

export default Avatar;
