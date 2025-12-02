import './Statistic.css';
import MetricCard from '../MetricCard/MetricCard';
import Toggle from '../Toggle/Toggle';
import TableChart from '../TableChart/TableChart';
import { useEffect, useState } from 'react';
import {
  type LikeInterface,
  type CommentInterface,
  type PostInterface,
  validateLike,
  validateComment,
  validatePost,
} from '../../types/post.types';
import libApi from '@/utils/libApi';

function Statistic() {
  const [isTableView, setIsTableView] = useState<boolean>(true);
  const [comments, setComments] = useState<CommentInterface[] | undefined>(undefined);
  const [likes, setLikes] = useState<LikeInterface[] | undefined>(undefined);
  const [posts, setPosts] = useState<PostInterface[] | undefined>(undefined);

  useEffect(() => {
    libApi
      .get(`/me/comments`)
      .then((data) => {
        return setComments(
          data.map((item: CommentInterface) => {
            return validateComment(item);
          }),
        );
      })
      .catch((error) => {
        console.error(error);
      });
    libApi
      .get(`/me/likes`)
      .then((data) => {
        return setLikes(
          data.map((item: CommentInterface) => {
            return validateLike(item);
          }),
        );
      })
      .catch((error) => {
        console.error(error);
      });
    libApi
      .get(`/me/posts`)
      .then((data) => {
        return setPosts(
          data.map((item: PostInterface) => {
            return validatePost(item);
          }),
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  function onTableViewToggle() {
    setIsTableView((prev) => !prev);
  }
  return (
    <div className="statistic">
      <div className="metric-cards">
        <MetricCard
          cardTitle="Comments"
          cardValue={comments?.length}
          valueComment="+20% month over month"
          className="statistic-metric-card"
        />
        <MetricCard
          cardTitle="Likes"
          cardValue={likes?.length}
          valueComment="+33% month over month"
          className="statistic-metric-card"
        />
        <MetricCard
          cardTitle="Posts"
          cardValue={posts?.length}
          valueComment="-8% month over month"
          className="statistic-metric-card"
        />
      </div>

      <Toggle
        visualMode="toggle"
        isOn={false}
        firstOption={isTableView ? '' : 'Table view'}
        secondOption={isTableView ? 'Enable chart view' : 'Chart view'}
        onToggle={onTableViewToggle}
      />
      <div className="table-charts-container">
        <div className="table-chart-wrapper">
          <p>Likes</p>
          <TableChart mode={isTableView ? 'table' : 'lineChart'} likes={likes} />
        </div>
        <div className="table-chart-wrapper">
          <p>Comments</p>
          <TableChart mode={isTableView ? 'table' : 'barChart'} comments={comments} />
        </div>
      </div>
    </div>
  );
}

export default Statistic;
