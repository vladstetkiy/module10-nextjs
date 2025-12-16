import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Post from './Post';

jest.mock('./Post.module.css', () => ({
  post: 'post',
  postAvatar: 'postAvatar',
  postDescription: 'postDescription',
}));

jest.mock('../PersonShortInfo/PersonShortInfo', () => ({
  __esModule: true,
  default: ({ itemId }: { itemId: number }) => <div data-testid="person-short-info">{itemId}</div>,
}));

jest.mock('../PostReactions/PostReactions', () => ({
  __esModule: true,
  default: ({ postId, likes }: { postId: number; likes: number }) => (
    <div data-testid="post-reactions">
      {postId}-{likes}
    </div>
  ),
}));

describe('Post component', () => {
  const mockPost = {
    id: 1,
    title: 'Test post',
    content: 'Hello world',
    authorId: 42,
    creationDate: '2024-01-01',
    modifiedDate: '2024-01-01',
    likesCount: 5,
    commentsCount: 0,
    image: null,
  };

  test('renders post content', () => {
    render(<Post {...mockPost} />);

    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  test('renders PersonShortInfo with correct authorId', () => {
    render(<Post {...mockPost} />);

    expect(screen.getByTestId('person-short-info')).toHaveTextContent('42');
  });

  test('renders PostReactions with correct props', () => {
    render(<Post {...mockPost} />);

    expect(screen.getByTestId('post-reactions')).toHaveTextContent('1-5');
  });
});
