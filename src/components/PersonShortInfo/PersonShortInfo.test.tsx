import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PersonShortInfo from './PersonShortInfo';

jest.mock('./PersonShortInfo.module.css', () => ({
  person: 'person',
  personShortAvatar: 'personShortAvatar',
  personInfo: 'personInfo',
  personName: 'personName',
  personOnline: 'personOnline',
}));

jest.mock('../Avatar/Avatar', () => ({
  __esModule: true,
  default: ({ avatarSrc }: { avatarSrc?: string }) => <div data-testid="avatar">{avatarSrc}</div>,
}));

jest.mock('@/utils/timeAgo', () => jest.fn(() => '2 days ago'));

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

jest.mock('@/utils/libApi', () => ({
  getMe: jest.fn(),
  getUser: jest.fn(),
  getGroup: jest.fn(),
}));

import { useQuery } from '@tanstack/react-query';

describe('PersonShortInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useQuery as jest.Mock).mockImplementation(() => ({
      data: null,
    }));
  });

  test('renders current user when isMe is true', () => {
    (useQuery as jest.Mock).mockImplementationOnce(() => ({
      data: {
        firstName: 'John',
        secondName: 'Doe',
        profileImage: 'me.jpg',
        creationDate: '2024-01-01',
      },
    }));

    render(<PersonShortInfo isMe />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('2 days ago')).toBeInTheDocument();
    expect(screen.getByTestId('avatar')).toHaveTextContent('me.jpg');
  });

  test('renders user by itemId', () => {
    (useQuery as jest.Mock).mockImplementationOnce(() => ({ data: null }));

    (useQuery as jest.Mock).mockImplementationOnce(() => ({
      data: {
        firstName: 'Alice',
        secondName: 'Smith',
        profileImage: 'user.jpg',
        creationDate: '2024-01-01',
      },
    }));

    render(<PersonShortInfo itemId={1} />);

    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('2 days ago')).toBeInTheDocument();
  });

  test('renders group info when isGroup is true', () => {
    (useQuery as jest.Mock).mockImplementationOnce(() => ({ data: null }));

    (useQuery as jest.Mock).mockImplementationOnce(() => ({ data: null }));

    (useQuery as jest.Mock).mockImplementationOnce(() => ({
      data: {
        title: 'React Group',
        membersCount: 123,
        photo: 'group.jpg',
      },
    }));

    render(<PersonShortInfo itemId={5} isGroup />);

    expect(screen.getByText('React Group')).toBeInTheDocument();
    expect(screen.getByText('123 members')).toBeInTheDocument();
    expect(screen.getByTestId('avatar')).toHaveTextContent('group.jpg');
  });
});
