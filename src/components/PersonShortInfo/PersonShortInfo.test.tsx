import { render, screen, waitFor } from '@testing-library/react';
import PersonShortInfo from './PersonShortInfo';
import libApi from '@/utils/libApi';
import timeAgo from '@/utils/timeAgo';

jest.mock('@/utils/libApi', () => ({
  get: jest.fn(),
}));

jest.mock('@/utils/timeAgo', () => jest.fn());

jest.mock('../Avatar/Avatar', () => ({ avatarSrc, className }: any) => (
  <div data-testid="avatar" className={className}>
    {avatarSrc ? `Avatar: ${avatarSrc}` : 'No Avatar'}
  </div>
));

jest.mock('./PersonShortInfo.css', () => ({}));

describe('PersonShortInfo Component', () => {
  const mockUser = {
    id: 1,
    firstName: 'John',
    secondName: 'Doe',
    profileImage: 'profile.jpg',
    creationDate: '2024-01-01T00:00:00.000Z',
  };

  const mockGroup = {
    id: 1,
    title: 'Test Group',
    photo: 'group.jpg',
    membersCount: 10,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (timeAgo as jest.Mock).mockReturnValue('2 days ago');
  });

  it('renders user info when itemId is provided', async () => {
    (libApi.get as jest.Mock).mockResolvedValue(mockUser);

    render(<PersonShortInfo itemId={1} />);

    expect(screen.getByTestId('avatar')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('2 days ago')).toBeInTheDocument();
    });

    expect(libApi.get).toHaveBeenCalledWith('/users/1');
  });

  it('renders current user info when isMe is true', async () => {
    (libApi.get as jest.Mock).mockResolvedValue(mockUser);

    render(<PersonShortInfo isMe={true} />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    expect(libApi.get).toHaveBeenCalledWith('/me');
  });

  it('renders group info when isGroup is true', async () => {
    (libApi.get as jest.Mock).mockResolvedValue(mockGroup);

    render(<PersonShortInfo itemId={1} isGroup={true} />);

    await waitFor(() => {
      expect(screen.getByText('Test Group')).toBeInTheDocument();
      expect(screen.getByText('10 members')).toBeInTheDocument();
    });

    expect(libApi.get).toHaveBeenCalledWith('/groups/1');
  });

  it('passes avatarClassName to Avatar component', () => {
    (libApi.get as jest.Mock).mockResolvedValue(mockUser);

    render(<PersonShortInfo itemId={1} avatarClassName="custom-class" />);

    const avatar = screen.getByTestId('avatar');
    expect(avatar).toHaveClass('custom-class');
  });

  it('handles API errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      return;
    });
    (libApi.get as jest.Mock).mockRejectedValue(new Error('API Error'));

    render(<PersonShortInfo itemId={1} />);

    await waitFor(() => {
      expect(screen.getByTestId('avatar')).toBeInTheDocument();
    });

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('shows user avatar when available', async () => {
    (libApi.get as jest.Mock).mockResolvedValue(mockUser);

    render(<PersonShortInfo itemId={1} />);

    await waitFor(() => {
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveTextContent('Avatar: profile.jpg');
    });
  });

  it('shows group avatar when available', async () => {
    (libApi.get as jest.Mock).mockResolvedValue(mockGroup);

    render(<PersonShortInfo itemId={1} isGroup={true} />);

    await waitFor(() => {
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveTextContent('Avatar: group.jpg');
    });
  });
});
