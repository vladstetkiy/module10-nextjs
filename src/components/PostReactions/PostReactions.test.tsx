import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PostReactions from './PostReactions';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ isAuth: true, personInfo: { id: 1 } }),
}));

jest.mock('@/contexts/NotificationContext/NotificationContext', () => ({
  useNotification: () => ({ showNotification: jest.fn() }),
}));

jest.mock('@/utils/libApi', () => ({
  __esModule: true,
  default: { post: jest.fn(), delete: jest.fn() },
  getPostComments: jest.fn(() =>
    Promise.resolve([
      {
        id: 1,
        text: 'Test comment',
        authorId: 1,
        postId: 1,
        creationDate: '',
        modifiedDate: '',
      },
    ]),
  ),
}));

const renderWithClient = (ui: React.ReactElement) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
};

describe('PostReactions', () => {
  it('renders likes', () => {
    renderWithClient(<PostReactions postId={1} likes={2} likedByUsers={[]} />);
    expect(screen.getByText('2 likesPlural2')).toBeInTheDocument();
  });

  it('adds comment', async () => {
    renderWithClient(<PostReactions postId={1} likes={0} likedByUsers={[]} />);
    fireEvent.change(screen.getByPlaceholderText('commentPlaceholder'), {
      target: { value: 'Hello' },
    });
    fireEvent.click(screen.getAllByText('addComment')[1]);
    expect(await screen.findByText('#1. Test comment')).toBeInTheDocument();
  });
});
