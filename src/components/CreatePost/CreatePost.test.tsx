import { render, screen, fireEvent, act } from '@testing-library/react';
import CreatePost from './CreatePost';
import { useTranslation } from 'react-i18next';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('../Avatar/Avatar', () => ({ avatarSrc, className }: any) => (
  <div data-testid="avatar" className={className}>
    Avatar
  </div>
));

jest.mock('../Button/Button', () => ({ text, onClick, className }: any) => (
  <button onClick={onClick} className={className} data-testid="create-post-button">
    {text}
  </button>
));

const mockCreatePostForm = jest.fn();
jest.mock('../CreatePostForm/CreatePostForm', () => (props: any) => {
  mockCreatePostForm(props);
  return <div data-testid="create-post-form" />;
});

jest.mock('./CreatePost.css', () => ({}));

jest.mock('../../types/post.types', () => ({
  validateUser: jest.fn((data) => ({
    id: data?.id || 0,
    username: data?.username || '',
    description: data?.description || '',
    lastLogin: data?.lastLogin || '',
    creationDate: data?.creationDate || '',
    modifiedDate: data?.modifiedDate || '',
    profileImage: data?.profileImage || '',
  })),
}));

describe('CreatePost Component', () => {
  const mockT = jest.fn((key: string) => {
    const translations: Record<string, string> = {
      whatsHappening: "What's happening?",
      tellEveryone: 'Tell Everyone',
    };
    return translations[key] || key;
  });

  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      t: mockT,
    });

    const mockUser = {
      profileImage: 'profile.jpg',
    };

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => JSON.stringify(mockUser)),
      },
      writable: true,
    });

    jest.clearAllMocks();
  });

  it('renders create post section', () => {
    render(<CreatePost />);

    expect(screen.getByTestId('avatar')).toBeInTheDocument();
    expect(screen.getByText("What's happening?")).toBeInTheDocument();
    expect(screen.getByText('Tell Everyone')).toBeInTheDocument();
  });

  it('opens create post form when button is clicked', () => {
    render(<CreatePost />);

    expect(screen.queryByTestId('create-post-form')).not.toBeInTheDocument();

    const button = screen.getByTestId('create-post-button');
    fireEvent.click(button);

    expect(screen.getByTestId('create-post-form')).toBeInTheDocument();
  });

  it('passes closeFunc to CreatePostForm', () => {
    render(<CreatePost />);

    const button = screen.getByTestId('create-post-button');
    fireEvent.click(button);

    expect(mockCreatePostForm).toHaveBeenCalled();
    const props = mockCreatePostForm.mock.calls[0][0];
    expect(props).toHaveProperty('closeFunc');
    expect(typeof props.closeFunc).toBe('function');
  });

  it('handles localStorage errors', () => {
    window.localStorage.getItem.mockReturnValue('invalid json');

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      return;
    });

    render(<CreatePost />);

    expect(screen.getByTestId('avatar')).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalledWith('invalid current user validation');

    consoleSpy.mockRestore();
  });

  it('handles empty localStorage', () => {
    window.localStorage.getItem.mockReturnValue(null);

    render(<CreatePost />);

    expect(screen.getByTestId('avatar')).toBeInTheDocument();
  });
});
