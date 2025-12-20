'use client';

import styles from './PersonShortInfo.module.css';
import Avatar from '../Avatar/Avatar';
import timeAgo from '@/utils/timeAgo';
import { useQuery } from '@tanstack/react-query';
import { getMe, getUser, getGroup } from '@/utils/libApi';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

export interface PersonShortInfoPropsInterface {
  itemId?: number;
  avatarClassName?: string;
  isMe?: boolean;
  isGroup?: boolean;
  descriptionText?: string;
  onClick?: () => void;
}

function PersonShortInfo({
  itemId,
  avatarClassName,
  isMe,
  isGroup,
  descriptionText,
  onClick,
}: PersonShortInfoPropsInterface) {
  const { i18n } = useTranslation();
  let language: 'ru' | 'en';
  if (i18n.language == 'ru') {
    language = 'ru';
  } else {
    language = 'en';
  }
  const { data: meData } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    enabled: !!isMe,
  });

  const { data: userData } = useQuery({
    queryKey: ['user', itemId],
    queryFn: () => getUser(itemId!),
    enabled: !!itemId && !isMe && !isGroup,
  });

  const { data: groupData } = useQuery({
    queryKey: ['group', itemId],
    queryFn: () => getGroup(itemId!),
    enabled: !!itemId && !!isGroup,
  });

  const author = isMe ? meData : userData;
  const group = groupData;

  return (
    <div className={styles.person} onClick={onClick}>
      <Avatar
        avatarSrc={isGroup ? group?.photo : author?.profileImage}
        className={`${styles.personShortAvatar} ${avatarClassName || ''}`.trim()}
      />
      <div className={styles.personInfo}>
        {isGroup ? (
          <>
            <p className={styles.personName}>{group?.title}</p>
            <p className={styles.personOnline}>{group?.membersCount + ' members'}</p>
          </>
        ) : (
          <>
            <p className={styles.personName}>{author?.firstName + ' ' + author?.secondName}</p>
            <p className={styles.personOnline}>
              {descriptionText ? descriptionText : timeAgo(author?.creationDate, language)}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default memo(PersonShortInfo);
