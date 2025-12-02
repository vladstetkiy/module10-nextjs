'use client';

import './PersonShortInfo.css';
import Avatar from '../Avatar/Avatar';
import { useEffect, useState } from 'react';
import type { GroupInterface, UserInterface } from '../../types/post.types.ts';
import timeAgo from '@/utils/timeAgo';
import libApi from '@/utils/libApi';

export interface PersonShortInfoPropsInterface {
  itemId?: number;
  avatarClassName?: string;
  isMe?: boolean;
  isGroup?: boolean;
}

function PersonShortInfo({
  itemId,
  avatarClassName,
  isMe,
  isGroup,
}: PersonShortInfoPropsInterface) {
  const [author, setAuthor] = useState<UserInterface | undefined>(undefined);
  const [group, setGroup] = useState<GroupInterface | undefined>(undefined);

  useEffect(() => {
    libApi
      .get(`${isMe ? `/me` : isGroup ? `/groups/${itemId}` : `/users/${itemId}`}`)
      .then((data) => {
        if (isGroup) {
          setGroup(data);
        } else {
          setAuthor(data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="person">
      <Avatar
        avatarSrc={isGroup ? group?.photo : author?.profileImage}
        className={'person-short-avatar ' + avatarClassName}
      />
      <div className="person-info">
        {isGroup ? (
          <>
            <p className="person-name">{group?.title}</p>
            <p className="person-online">{group?.membersCount + ' members'}</p>
          </>
        ) : (
          <>
            <p className="person-name">{author?.firstName + ' ' + author?.secondName}</p>
            <p className="person-online">{timeAgo(author?.creationDate)}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default PersonShortInfo;
