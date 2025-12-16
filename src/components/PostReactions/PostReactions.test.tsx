import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostReactions from './PostReactions';

jest.mock('./PostReactions.module.css', () => ({}));

jest.mock('../Button/Button', () => (props: any) => (
  <button onClick={props.onClick}>{props.children}</button>
));

jest.mock('../Input/Input', () => (props: any) => (
  <input placeholder={props.placeholder} value={props.value} onChange={props.onChange} />
));

jest.mock('../svg/LikeSvg/LikeSvg', () => () => <span>like</span>);
jest.mock('../svg/CommentSvg/CommentSvg', () => () => <span>comment</span>);
jest.mock('../svg/RowSvg/RowSvg', () => () => <span>row</span>);
jest.mock('../svg/PenSvg/PenSvg', () => () => <span>pen</span>);

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockInvalidateQueries = jest.fn();
const mockMutate = jest.fn();

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: mockInvalidateQueries,
  }),
  useQuery: () => ({
    data: [
      { id: 1, text: 'First comment' },
      { id: 2, text: 'Second comment' },
    ],
  }),
  useMutation: () => ({
    mutate: mockMutate,
  }),
}));

jest.mock('@/utils/libApi', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
  getPostComments: jest.fn(),
}));

describe('PostReactions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders likes count', () => {
    localStorage.setItem('isAuth', 'true');

    render(<PostReactions postId={1} likes={5} />);

    expect(screen.getByText('5 likesPlural2')).toBeInTheDocument();
  });

  test('increments likes on click', () => {
    localStorage.setItem('isAuth', 'true');

    render(<PostReactions postId={1} likes={1} />);

    fireEvent.click(screen.getByText('like'));

    expect(screen.getByText('2 likesPlural2')).toBeInTheDocument();
  });

  test('renders comments for authorized user', () => {
    localStorage.setItem('isAuth', 'true');

    render(<PostReactions postId={1} likes={0} />);

    expect(screen.getByText('#1. First comment')).toBeInTheDocument();
    expect(screen.getByText('#2. Second comment')).toBeInTheDocument();
  });

  test('shows login message for unauthorized user', () => {
    render(<PostReactions postId={1} likes={0} />);

    expect(screen.getByText('loginToSeeComments')).toBeInTheDocument();
  });

  test('adds new comment', async () => {
    localStorage.setItem('isAuth', 'true');

    render(<PostReactions postId={1} likes={0} />);

    fireEvent.change(screen.getByPlaceholderText('commentPlaceholder'), {
      target: { value: 'New comment' },
    });

    fireEvent.click(screen.getByText('addComment'));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
    });
  });
});
