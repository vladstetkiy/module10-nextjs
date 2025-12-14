import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ListCard from './ListCard';

jest.mock('./ListCard.module.css', () => ({
  listContainer: 'listContainer',
  listContainerTitle: 'listContainerTitle',
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('../PersonShortInfo/PersonShortInfo', () => ({
  __esModule: true,
  default: ({ itemId, isGroup }: { itemId: number; isGroup?: boolean }) => (
    <div data-testid="person-short-info">
      {itemId}-{String(isGroup)}
    </div>
  ),
}));

import { useAuth } from '@/hooks/useAuth';

describe('ListCard', () => {
  const users = [{ id: 1 }, { id: 2 }] as any[];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns null when user is not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuth: false });

    const { container } = render(<ListCard title="users" items={users} />);

    expect(container.firstChild).toBeNull();
  });

  test('renders title and list when authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuth: true });

    render(<ListCard title="users" items={users} />);

    expect(screen.getByText('users')).toBeInTheDocument();
    expect(screen.getAllByTestId('person-short-info')).toHaveLength(2);
  });

  test('passes isGroup prop when isGroups is true', () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuth: true });

    render(<ListCard title="groups" items={users} isGroups />);

    const items = screen.getAllByTestId('person-short-info');

    expect(items[0]).toHaveTextContent('1-true');
    expect(items[1]).toHaveTextContent('2-true');
  });
});
