import styles from './Avatar.module.css';
import Image from 'next/image';

export interface AvatarPropsInterface {
  avatarSrc?: string;
  className?: string;
}

function Avatar({ avatarSrc = '', className }: AvatarPropsInterface) {
  return (
    <Image
      src={avatarSrc}
      width={50}
      height={50}
      alt=""
      className={className + ' ' + styles.avatar}
    />
  );
}

export default Avatar;
