// TableChart.test.tsx
import { render, screen } from '@testing-library/react';
import TableChart from './TableChart';
import { useTranslation } from 'react-i18next';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('recharts', () => ({
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }: any) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
}));

jest.mock('./TableChart.module.css', () => ({}));

describe('TableChart Component', () => {
  const mockT = jest.fn((key: string) => key);
  const mockI18n = { language: 'en' };

  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      t: mockT,
      i18n: mockI18n,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders table mode with likes data', () => {
    const mockLikes = [
      { id: 1, creationDate: '2024-01-01', type: 'like', postId: 1, userId: 1 },
      { id: 2, creationDate: '2024-01-01', type: 'like', postId: 2, userId: 2 },
    ];

    render(<TableChart mode="table" likes={mockLikes} />);

    expect(mockT).toHaveBeenCalledWith('month');
    expect(mockT).toHaveBeenCalledWith('commentsCountStats');
    expect(mockT).toHaveBeenCalledWith('likesStat');
  });

  it('renders table mode with comments data', () => {
    const mockComments = [
      {
        id: 1,
        text: 'comment 1',
        authorId: 1,
        postId: 1,
        creationDate: '2024-01-01',
        modifiedDate: '2024-01-01',
      },
      {
        id: 2,
        text: 'comment 2',
        authorId: 2,
        postId: 2,
        creationDate: '2024-01-02',
        modifiedDate: '2024-01-02',
      },
    ];

    render(<TableChart mode="table" comments={mockComments} />);

    expect(mockT).toHaveBeenCalledWith('month');
    expect(mockT).toHaveBeenCalledWith('commentsCountStats');
  });

  it('renders line chart mode with likes data', () => {
    const mockLikes = [{ id: 1, creationDate: '2024-01-01', type: 'like', postId: 1, userId: 1 }];

    render(<TableChart mode="lineChart" likes={mockLikes} />);

    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();

    expect(mockT).toHaveBeenCalledWith('likesCountStats');
  });

  it('renders bar chart mode with comments data', () => {
    const mockComments = [
      {
        id: 1,
        text: 'comment 1',
        authorId: 1,
        postId: 1,
        creationDate: '2024-01-01',
        modifiedDate: '2024-01-01',
      },
    ];

    render(<TableChart mode="barChart" comments={mockComments} />);

    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();

    expect(mockT).toHaveBeenCalledWith('commentsCountStats');
  });

  it('renders empty state when no data provided', () => {
    render(<TableChart mode="table" />);

    expect(mockT).toHaveBeenCalledWith('month');
    expect(mockT).toHaveBeenCalledWith('commentsCountStats');
  });

  it('uses correct language for date formatting', () => {
    const mockComments = [
      {
        id: 1,
        text: 'comment 1',
        authorId: 1,
        postId: 1,
        creationDate: '2024-01-01',
        modifiedDate: '2024-01-01',
      },
    ];

    (useTranslation as jest.Mock).mockReturnValue({
      t: mockT,
      i18n: { language: 'en' },
    });

    render(<TableChart mode="table" comments={mockComments} />);

    (useTranslation as jest.Mock).mockReturnValue({
      t: mockT,
      i18n: { language: 'ru' },
    });

    render(<TableChart mode="table" comments={mockComments} />);
  });
});
