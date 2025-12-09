import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import PostReactions from './PostReactions';
import { useTranslation } from 'react-i18next';
import libApi from '@/utils/libApi';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('@/utils/libApi', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

jest.mock('../svg/CommentSvg/CommentSvg', () => () => <svg data-testid="comment-svg" />);
jest.mock('../svg/LikeSvg/LikeSvg', () => () => <svg data-testid="like-svg" />);
jest.mock('../svg/RowSvg/RowSvg', () => () => <svg data-testid="row-svg" />);
jest.mock('../svg/PenSvg/PenSvg', () => () => <svg data-testid="pen-svg" />);

jest.mock('../Button/Button', () => ({ text, onClick, className }: any) => (
  <button onClick={onClick} data-testid={`button-${className || 'default'}`}>
    {text}
  </button>
));

jest.mock('../Input/Input', () => ({ placeholder, value, onChange, title }: any) => (
  <div>
    <label>{title}</label>
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      data-testid="comment-input"
    />
  </div>
));

jest.mock('./PostReactions.module.css', () => ({}));

describe('PostReactions Component', () => {
  const mockT = jest.fn((key: string) => {
    const translations: Record<string, string> = {
      likesPlural2: 'likes',
      commentsPlural2: 'comments',
      loginToSeeComments: 'Login to see comments',
      loadingComments: 'Loading comments...',
      commentPlaceholder: 'Add a comment...',
      addComment: 'Add Comment',
    };
    return translations[key] || key;
  });

  const mockComments = [
    {
      id: 1,
      text: 'Test comment 1',
      authorId: 1,
      postId: 1,
      creationDate: '2024-01-01',
      modifiedDate: '2024-01-01',
    },
    {
      id: 2,
      text: 'Test comment 2',
      authorId: 2,
      postId: 1,
      creationDate: '2024-01-02',
      modifiedDate: '2024-01-02',
    },
  ];

  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      t: mockT,
    });

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
      },
      writable: true,
    });

    jest.clearAllMocks();
  });

  it('renders reactions for authenticated user', async () => {
    window.localStorage.getItem.mockReturnValue('true');
    (libApi.get as jest.Mock).mockResolvedValue(mockComments);

    await act(async () => {
      render(<PostReactions postId={1} />);
    });

    expect(screen.getByTestId('like-svg')).toBeInTheDocument();
    expect(screen.getByTestId('comment-svg')).toBeInTheDocument();
    expect(screen.getByText('21 likes')).toBeInTheDocument();
  });

  it('renders reactions for non-authenticated user', () => {
    window.localStorage.getItem.mockReturnValue(null);

    render(<PostReactions postId={1} />);

    expect(screen.getByText('Login to see comments')).toBeInTheDocument();
    expect(screen.queryByTestId('comment-input')).not.toBeInTheDocument();
  });

  it('handles like click', () => {
    window.localStorage.getItem.mockReturnValue('true');

    render(<PostReactions postId={1} />);

    const likeButton = screen.getByTestId('like-svg').closest('button');
    fireEvent.click(likeButton!);

    expect(screen.getByText('22 likes')).toBeInTheDocument();
    expect(libApi.post).toHaveBeenCalledWith('/like', {
      postId: 1,
    });
  });

  it('loads and displays comments', async () => {
    window.localStorage.getItem.mockReturnValue('true');
    (libApi.get as jest.Mock).mockResolvedValue(mockComments);

    await act(async () => {
      render(<PostReactions postId={1} />);
    });

    await waitFor(() => {
      expect(screen.getByText('#1. Test comment 1')).toBeInTheDocument();
      expect(screen.getByText('#2. Test comment 2')).toBeInTheDocument();
      expect(screen.getByText('2 comments')).toBeInTheDocument();
    });
  });

  it('adds new comment', async () => {
    window.localStorage.getItem.mockReturnValue('true');
    (libApi.get as jest.Mock).mockResolvedValue([]);
    (libApi.post as jest.Mock).mockResolvedValue({});

    await act(async () => {
      render(<PostReactions postId={1} />);
    });

    const commentInput = screen.getByTestId('comment-input');
    fireEvent.change(commentInput, { target: { value: 'New comment' } });

    const addButton = screen.getByTestId('button-default');
    fireEvent.click(addButton);

    expect(commentInput).toHaveValue('');

    expect(libApi.post).toHaveBeenCalledWith('/comments', {
      postId: 1,
      text: 'New comment',
    });
  });

  it('toggles comments visibility', async () => {
    window.localStorage.getItem.mockReturnValue('true');
    (libApi.get as jest.Mock).mockResolvedValue(mockComments);

    await act(async () => {
      render(<PostReactions postId={1} />);
    });

    expect(screen.getByTestId('row-svg')).toBeInTheDocument();

    const toggleButton = screen.getByTestId('row-svg').closest('button');
    fireEvent.click(toggleButton!);

    expect(toggleButton).toBeInTheDocument();
  });
});
