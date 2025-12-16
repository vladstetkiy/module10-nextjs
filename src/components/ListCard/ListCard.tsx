'use client';

import styles from './ListCard.module.css';
import PersonShortInfo from '../PersonShortInfo/PersonShortInfo';
import { type UserInterface, type GroupInterface } from '../../types/post.types';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
interface PropsInterface {
  title: string;
  items: UserInterface[] | GroupInterface[];
  isGroups?: boolean;
}

function ListCard({ title, items, isGroups }: PropsInterface) {
  const { isAuth } = useAuth();
  const { t } = useTranslation();
  if (!isAuth) {
    return null;
  }

  if (!Array.isArray(items)) {
    console.error('Items is not an array:', items);
    return null;
  }
  return (
    <div className={styles.listContainer}>
      <p className={styles.listContainerTitle}>{t(title)}</p>
      {items.map((item) => {
        return <PersonShortInfo key={item.id} itemId={item.id} isGroup={isGroups} />;
      })}
    </div>
  );
}

export default ListCard;
