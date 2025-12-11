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
    <div className={styles.statistic}>
      <div className={styles.metricCards}>
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

      <Toggle
        visualMode="toggle"
        isOn={false}
        firstOption={isTableView ? '' : t('tableView')}
        secondOption={isTableView ? t('chartView') : t('chartView')}
        onToggle={onTableViewToggle}
      />
      <div className={styles.tableChartsContainer}>
        <div className={styles.tableChartWrapper}>
          <p>{t('likesStat')}</p>
          <TableChart mode={isTableView ? 'table' : 'lineChart'} likes={likes} />
        </div>
        <div className={styles.tableChartWrapper}>
          <p>{t('commentsStat')}</p>
          <TableChart mode={isTableView ? 'table' : 'barChart'} comments={comments} />
        </div>
      </div>
    </div>
  );
}

export default Statistic;
