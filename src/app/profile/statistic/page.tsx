'use client';

import styles from './page.module.css';
import MetricCard from '@/components/MetricCard/MetricCard';
import Toggle from '@/components/Toggle/Toggle';
import TableChart from '@/components/TableChart/TableChart';
import { useState } from 'react';
import { getStatistic } from '@/utils/libApi';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';

function Statistic() {
  const { t } = useTranslation();
  const [isTableView, setIsTableView] = useState<boolean>(true);

  const { data } = useQuery({
    queryKey: ['userData'],
    queryFn: getStatistic,
  });

  const [comments, likes, posts] = data || [];

  function onTableViewToggle() {
    setIsTableView((prev) => !prev);
  }

  return (
    <div className={styles.statistic} data-testid="statistic-page">
      <div className={styles.metricCards} data-testid="metric-cards">
        <MetricCard
          cardTitle={t('commentsStat')}
          cardValue={comments?.length}
          valueComment={t('percentStats')}
          className={styles.statisticMetricCard}
        />
        <MetricCard
          cardTitle={t('likesStat')}
          cardValue={likes?.length}
          valueComment={t('percentStats')}
          className={styles.statisticMetricCard}
        />
        <MetricCard
          cardTitle="Posts"
          cardValue={posts?.length}
          valueComment={t('percentStats')}
          className={styles.statisticMetricCard}
        />
      </div>

      <div data-testid="view-toggle-wrapper">
        <Toggle
          visualMode="toggle"
          isOn={!isTableView}
          firstOption={t('tableView')}
          secondOption={t('chartView')}
          onToggle={onTableViewToggle}
          dataTestId="view-toggle"
        />
      </div>

      <div className={styles.tableChartsContainer} data-testid="charts-container">
        <div className={styles.tableChartWrapper} data-testid="likes-stat">
          <p>{t('likesStat')}</p>
          <TableChart
            mode={isTableView ? 'table' : 'lineChart'}
            likes={likes}
            data-testid="likes-chart"
          />
        </div>

        <div className={styles.tableChartWrapper} data-testid="comments-stat">
          <p>{t('commentsStat')}</p>
          <TableChart
            mode={isTableView ? 'table' : 'barChart'}
            comments={comments}
            data-testid="comments-chart"
          />
        </div>
      </div>
    </div>
  );
}

export default Statistic;
