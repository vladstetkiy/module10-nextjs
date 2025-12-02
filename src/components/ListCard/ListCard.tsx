import './ListCard.css';
import PersonShortInfo from '../PersonShortInfo/PersonShortInfo';
import { type UserInterface, type GroupInterface } from '../../types/post.types';
interface PropsInterface {
  title: string;
  items: UserInterface[] | GroupInterface[];
  isGroups?: boolean;
}

function ListCard({ title, items, isGroups }: PropsInterface) {
  if (!Array.isArray(items)) {
    console.warn('Items is not an array:', items);
    return <div>No items to display</div>;
  }
  return (
    <div className="list-container">
      <p className="list-container-title">{title}</p>
      {items.map((item) => {
        return <PersonShortInfo itemId={item.id} isGroup={isGroups} />;
      })}
    </div>
  );
}

export default ListCard;
