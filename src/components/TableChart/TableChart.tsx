import styles from './TableChart.module.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { type LikeInterface, type CommentInterface } from '../../types/post.types';
import { useTranslation } from 'react-i18next';

type tableChardMode = 'table' | 'lineChart' | 'barChart';

interface TableChartPropsInterface {
  mode: tableChardMode;
  comments?: CommentInterface[];
  likes?: LikeInterface[];
}

interface TableDataInterface {
  row: string | number;
  col2: string | number;
  col3: string | number;
}

function TableChart({ mode, comments = [], likes = [] }: TableChartPropsInterface) {
  const { t, i18n } = useTranslation();

  const formatDate = (dateString: string): string => {
    return new Intl.DateTimeFormat(i18n.language === 'ru' ? 'ru-RU' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  const lineChartData = likes.map((like) => ({
    date: formatDate(like.creationDate),
    likes: 1,
  }));
  const aggregatedLineData = lineChartData.reduce(
    (acc, item) => {
      const existing = acc.find((i) => i.date === item.date);
      if (existing) {
        existing.likes += 1;
      } else {
        acc.push({ ...item });
      }
      return acc;
    },
    [] as { date: string; likes: number }[],
  );

  const barChartData = comments.map((comment) => ({
    date: formatDate(comment.creationDate),
    comments: 1,
  }));

  const aggregatedBarData = barChartData.reduce(
    (acc, item) => {
      const existing = acc.find((i) => i.date === item.date);
      if (existing) {
        existing.comments += 1;
      } else {
        acc.push({ ...item });
      }
      return acc;
    },
    [] as { date: string; comments: number }[],
  );
  let tableDataLikes: TableDataInterface[] = [];
  let tableDataComments: TableDataInterface[] = [];

  if (comments.length > 0) {
    tableDataComments = aggregatedBarData.map((item, i) => {
      return { row: `${item.date}`, col2: `${item.comments}`, col3: i + 1 };
    });
  }
  if (likes.length > 0) {
    tableDataLikes = aggregatedLineData.map((item, i) => {
      return { row: `${item.date}`, col2: `${item.likes}`, col3: i + 1 };
    });
  }

  return (
    <div className={styles.tableChartWrapper}>
      <div className={styles.tableContainer}>
        <h3 className={styles.tableTitle}>
          {mode === 'lineChart'
            ? t('likesCountStats')
            : mode === 'barChart'
              ? t('commentsCountStats')
              : t('likesStat')}
        </h3>

        {mode == 'table' ? (
          <>
            <div className={styles.tableHeader}>
              <div className={styles.headerCell}>{t('month')}</div>
              <div className={`${styles.headerCell} ${styles.secondColumnHeader}`}>
                {t('commentsCountStats')}
              </div>
              <div className={styles.headerCell}>№</div>
            </div>

            <div className={styles.tableBody}>
              {likes.length > 0
                ? tableDataLikes.map((item, index) => (
                  <div key={index} className={styles.tableRow}>
                    <div className={styles.dataCeil}>{item.row}</div>
                    <div className={`${styles.dataCell} ${styles.secondColumn}`}>{item.col2}</div>
                    <div className={styles.dataCell}>{item.col3}</div>
                  </div>
                ))
                : null}
              {comments.length > 0
                ? tableDataComments.map((item, index) => (
                  <div key={index} className={styles.tableRow}>
                    <div className={styles.dataCeil}>{item.row}</div>
                    <div className={`${styles.dataCell} ${styles.secondColumn}`}>{item.col2}</div>
                    <div className={styles.dataCell}>{item.col3}</div>
                  </div>
                ))
                : null}
            </div>
          </>
        ) : (
          <div style={{ width: '100%', height: '100%', paddingBottom: 24 }}>
            <ResponsiveContainer width="100%" height="100%">
              {mode === 'lineChart' ? (
                <LineChart data={aggregatedLineData} margin={{ left: -30 }}>
                  <CartesianGrid
                    vertical={false}
                    stroke="var(--component-stroke-dark-soft)"
                    strokeDasharray="0"
                    horizontal={true}
                    strokeWidth={1}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: 'var(--component-text-gray)', fontSize: 14 }}
                    axisLine={{ stroke: 'var(--component-stroke-dark-soft)' }}
                    tickLine={false}
                    domain={[0, 'auto']}
                    padding={{ left: 70 }}
                  />
                  <YAxis
                    tick={{
                      fill: 'var(--component-text-gray)',
                      fontSize: 14,
                      dy: 10,
                      dx: -15,
                    }}
                    domain={[0, 'auto']}
                    tickCount={9}
                    mirror={true}
                    tickMargin={40}
                  />
                  <Tooltip
                    cursor={{ stroke: 'var(--component-stroke-dark-soft)', strokeWidth: 2 }}
                    contentStyle={{
                      backgroundColor: 'var(--background-fill-surface)',
                      border: '1px solid var(--component-stroke-dark-soft)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      color: 'var(--component-text-gray)',
                      fontSize: '14px',
                    }}
                    itemStyle={{ color: 'var(--component-text-gray)' }}
                    formatter={(value: number) => [value, t('likesStat')]}
                    labelStyle={{ fontWeight: '600', color: 'var(--component-text-gray)' }}
                  />
                  <Line
                    type="linear"
                    dataKey="likes"
                    stroke="var(--component-stroke-dark-soft)"
                    strokeWidth={3}
                    dot={{ r: 0 }}
                    activeDot={{
                      r: 6,
                      stroke: `white, 0.5)`,
                      strokeWidth: 0,
                      fill: 'white',
                    }}
                  />
                </LineChart>
              ) : (
                <BarChart data={aggregatedBarData} margin={{ left: -30 }}>
                  <CartesianGrid
                    vertical={false}
                    stroke="var(--component-stroke-dark-soft)"
                    strokeDasharray="0"
                    horizontal={true}
                    strokeWidth={1}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: 'var(--component-text-gray)', fontSize: 14 }}
                    axisLine={{ stroke: 'var(--component-stroke-dark-soft)' }}
                    tickLine={false}
                    domain={[0, 'auto']}
                    padding={{ left: 70 }}
                  />
                  <YAxis
                    tick={{
                      fill: 'var(--component-text-gray)',
                      fontSize: 14,
                      dy: 10,
                      dx: -15,
                    }}
                    domain={[0, 'auto']}
                    tickCount={9}
                    mirror={true}
                    tickMargin={40}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                    contentStyle={{
                      backgroundColor: 'var(--background-fill-surface)',
                      border: '1px solid var(--component-stroke-dark-soft)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      color: 'var(--component-stroke-dark-soft)',
                      fontSize: '14px',
                    }}
                    itemStyle={{ color: 'var(--component-text-gray)' }}
                    formatter={(value: number) => [value, t('commentsStat')]}
                    labelStyle={{ fontWeight: '600', color: 'var(--component-text-gray)' }}
                  />
                  <Bar
                    dataKey="comments"
                    fill="var(--component-stroke-dark-soft)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export default TableChart;
