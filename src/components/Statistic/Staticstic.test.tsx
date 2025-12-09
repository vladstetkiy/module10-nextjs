import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import Statistic from './Statistic';
import { useTranslation } from 'react-i18next';
import libApi from '@/utils/libApi';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('@/utils/libApi', () => ({
  get: jest.fn(),
}));

jest.mock('../MetricCard/MetricCard', () => ({
  __esModule: true,
  default: ({ cardTitle, cardValue, valueComment, className }: any) => (
    <div data-testid="metric-card" className={className}>
      <span data-testid="metric-title">{cardTitle}</span>
      <span data-testid="metric-value">{cardValue}</span>
      <span data-testid="metric-comment">{valueComment}</span>
    </div>
  ),
}));

jest.mock('../Toggle/Toggle', () => ({
  __esModule: true,
  default: ({ onToggle, firstOption, secondOption }: any) => (
    <button
      data-testid="toggle"
      onClick={onToggle}
      aria-label={`toggle-${firstOption}-${secondOption}`}
    >
      Toggle
    </button>
  ),
}));

jest.mock('../TableChart/TableChart', () => ({
  __esModule: true,
  default: ({ mode, likes, comments }: any) => (
    <div data-testid="table-chart">
      <span data-testid="chart-mode">{mode}</span>
      {likes && <span data-testid="has-likes">has-likes</span>}
      {comments && <span data-testid="has-comments">has-comments</span>}
    </div>
  ),
}));

jest.mock('./Statistic.module.css', () => ({}));

describe('Statistic Component', () => {
  const mockT = jest.fn((key: string) => {
    const translations: Record<string, string> = {
      commentsStat: 'Comments',
      likesStat: 'Likes',
      percentStats: '%',
      tableView: 'Table View',
      chartView: 'Chart View',
    };
    return translations[key] || key;
  });

  const mockData = {
    comments: [
      {
        id: 1,
        text: 'test comment',
        authorId: 1,
        postId: 1,
        creationDate: '2024-01-01',
        modifiedDate: '2024-01-01',
      },
    ],
    likes: [
      {
        id: 1,
        type: 'like',
        postId: 1,
        userId: 1,
        creationDate: '2024-01-01',
      },
    ],
    posts: [
      {
        id: 1,
        title: 'test post',
        content: 'test content',
        authorId: 1,
        creationDate: '2024-01-01',
        modifiedDate: '2024-01-01',
        likesCount: 0,
        commentsCount: 0,
      },
    ],
  };

  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      t: mockT,
    });

    (libApi.get as jest.Mock).mockImplementation((url: string) => {
      if (url === '/me/comments') {
        return Promise.resolve(mockData.comments);
      }
      if (url === '/me/likes') {
        return Promise.resolve(mockData.likes);
      }
      if (url === '/me/posts') {
        return Promise.resolve(mockData.posts);
      }
      return Promise.resolve([]);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders component without errors', async () => {
    await act(async () => {
      render(<Statistic />);
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('metric-card')).toHaveLength(3);
    });

    expect(screen.getByTestId('toggle')).toBeInTheDocument();
  });

  it('loads and displays data on mount', async () => {
    await act(async () => {
      render(<Statistic />);
    });

    await waitFor(() => {
      expect(libApi.get).toHaveBeenCalledWith('/me/comments');
      expect(libApi.get).toHaveBeenCalledWith('/me/likes');
      expect(libApi.get).toHaveBeenCalledWith('/me/posts');
    });

    await waitFor(() => {
      const metricValues = screen.getAllByTestId('metric-value');
      expect(metricValues[0]).toHaveTextContent('1');
      expect(metricValues[1]).toHaveTextContent('1');
      expect(metricValues[2]).toHaveTextContent('1');
    });
  });

  it('handles errors when loading data', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      return;
    });
    (libApi.get as jest.Mock).mockRejectedValue(new Error('API Error'));

    await act(async () => {
      render(<Statistic />);
    });

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it('switches between table and chart view mode', async () => {
    await act(async () => {
      render(<Statistic />);
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('table-chart')).toHaveLength(2);
    });

    const toggleButton = screen.getByTestId('toggle');

    let charts = screen.getAllByTestId('table-chart');
    charts.forEach((chart) => {
      expect(chart).toHaveTextContent('table');
    });

    fireEvent.click(toggleButton);

    await waitFor(() => {
      charts = screen.getAllByTestId('table-chart');
      expect(charts[0]).toHaveTextContent('lineChart');
      expect(charts[1]).toHaveTextContent('barChart');
    });
  });

  it('uses translations for texts', async () => {
    await act(async () => {
      render(<Statistic />);
    });

    await waitFor(() => {
      expect(mockT).toHaveBeenCalledWith('commentsStat');
      expect(mockT).toHaveBeenCalledWith('likesStat');
      expect(mockT).toHaveBeenCalledWith('percentStats');
    });
  });

  it('passes correct props to TableChart', async () => {
    await act(async () => {
      render(<Statistic />);
    });

    await waitFor(() => {
      const charts = screen.getAllByTestId('table-chart');

      expect(charts[0]).toContainElement(screen.getByTestId('has-likes'));

      expect(charts[1]).toContainElement(screen.getByTestId('has-comments'));
    });
  });

  it('displays correct metric titles', async () => {
    await act(async () => {
      render(<Statistic />);
    });

    await waitFor(() => {
      const metricTitles = screen.getAllByTestId('metric-title');
      expect(metricTitles[0]).toHaveTextContent('Comments');
      expect(metricTitles[1]).toHaveTextContent('Likes');
      expect(metricTitles[2]).toHaveTextContent('Posts');
    });
  });

  it('displays metric comments', async () => {
    await act(async () => {
      render(<Statistic />);
    });

    await waitFor(() => {
      const metricComments = screen.getAllByTestId('metric-comment');
      metricComments.forEach((comment) => {
        expect(comment).toHaveTextContent('%');
      });
    });
  });
});
