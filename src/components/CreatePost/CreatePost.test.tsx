import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreatePost from './CreatePost';

jest.mock('./CreatePost.module.css', () => ({}));

jest.mock('../Avatar/Avatar', () => () => <div data-testid="avatar" />);

jest.mock('../CreatePostForm/CreatePostForm', () => (props: any) => (
  <div data-testid="create-post-form">
    <button onClick={props.closeFunc}>close</button>
  </div>
));

const mockUseAuth = jest.fn();

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('CreatePost', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders nothing when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuth: false });

    const { container } = render(<CreatePost />);
    expect(container.firstChild).toBeNull();
  });

  test('renders create post section when user is authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuth: true });

    render(<CreatePost />);

    expect(screen.getByText('whatsHappening')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByTestId('avatar')).toBeInTheDocument();
  });

  test('opens CreatePostForm on button click', () => {
    mockUseAuth.mockReturnValue({ isAuth: true });

    render(<CreatePost />);

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByTestId('create-post-form')).toBeInTheDocument();
  });

  test('closes CreatePostForm when closeFunc is called', () => {
    mockUseAuth.mockReturnValue({ isAuth: true });

    render(<CreatePost />);

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('create-post-form')).toBeInTheDocument();

    fireEvent.click(screen.getByText('close'));
    expect(screen.queryByTestId('create-post-form')).not.toBeInTheDocument();
  });
});
