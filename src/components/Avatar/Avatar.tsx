import styles from './Avatar.module.css';
import Image from 'next/image';
import { IS_STATIC_EXPORT } from '@/utils/config';

export interface AvatarPropsInterface {
  avatarSrc?: string;
  className?: string;
}

function Avatar({ avatarSrc = '', className }: AvatarPropsInterface) {
  return (
    <Image
      src={(IS_STATIC_EXPORT ? '/module10-nextjs/' : '') + avatarSrc}
      width={50}
      height={50}
      alt="a"
      className={className + ' ' + styles.avatar}
    />
  );
}

export default Avatar;
