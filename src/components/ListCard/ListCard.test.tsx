import { render, screen } from '@testing-library/react';
import ListCard from './ListCard';
import { GroupInterface, UserInterface } from '@/types/post.types';

let personShortInfoProps: any[] = [];

jest.mock('../PersonShortInfo/PersonShortInfo', () => {
  const MockPersonShortInfo = (props: any) => {
    personShortInfoProps.push(props);
    return <div data-testid="person-short-info" />;
  };
  MockPersonShortInfo.displayName = 'MockPersonShortInfo';
  return MockPersonShortInfo;
});

jest.mock('./ListCard.css', () => ({}));

describe('ListCard Component', () => {
  const mockUsers = [
    { id: 1, firstName: 'John', secondName: 'Doe' },
    { id: 2, firstName: 'Jane', secondName: 'Smith' },
  ] as UserInterface[];

  const mockGroups = [
    { id: 1, title: 'Group 1' },
    { id: 2, title: 'Group 2' },
  ] as GroupInterface[];

  beforeEach(() => {
    personShortInfoProps = [];

    jest.spyOn(console, 'error').mockImplementation((message) => {
      if (!message.includes('key')) {
        console.error(message);
      }
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders title and list of users', () => {
    render(<ListCard title="Users List" items={mockUsers} />);

    expect(screen.getByText('Users List')).toBeInTheDocument();
    expect(screen.getAllByTestId('person-short-info')).toHaveLength(2);
  });

  it('renders title and list of groups when isGroups is true', () => {
    render(<ListCard title="Groups List" items={mockGroups} isGroups={true} />);

    expect(screen.getByText('Groups List')).toBeInTheDocument();
    expect(screen.getAllByTestId('person-short-info')).toHaveLength(2);
  });

  it('passes correct props to PersonShortInfo for users', () => {
    render(<ListCard title="Test" items={mockUsers} />);

    expect(personShortInfoProps).toHaveLength(2);
    expect(personShortInfoProps[0]).toEqual({
      itemId: 1,
      isGroup: undefined,
    });
    expect(personShortInfoProps[1]).toEqual({
      itemId: 2,
      isGroup: undefined,
    });
  });

  it('passes correct props to PersonShortInfo for groups', () => {
    render(<ListCard title="Test" items={mockGroups} isGroups={true} />);

    expect(personShortInfoProps).toHaveLength(2);
    expect(personShortInfoProps[0]).toEqual({
      itemId: 1,
      isGroup: true,
    });
    expect(personShortInfoProps[1]).toEqual({
      itemId: 2,
      isGroup: true,
    });
  });

  it('handles empty array', () => {
    render(<ListCard title="Empty List" items={[]} />);

    expect(screen.getByText('Empty List')).toBeInTheDocument();
    expect(screen.queryAllByTestId('person-short-info')).toHaveLength(0);
  });
});
