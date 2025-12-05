import { render, screen } from '@testing-library/react';
import Post from './Post';
import { PostInterface } from '@/types/post.types';

let personShortInfoProps: any = null;
let postReactionsProps: any = null;

jest.mock('../PersonShortInfo/PersonShortInfo', () => {
  const MockPersonShortInfo = (props: any) => {
    personShortInfoProps = props;
    return <div data-testid="person-short-info" />;
  };
  MockPersonShortInfo.displayName = 'MockPersonShortInfo';
  return MockPersonShortInfo;
});

jest.mock('../PostReactions/PostReactions', () => {
  const MockPostReactions = (props: any) => {
    postReactionsProps = props;
    return <div data-testid="post-reactions" />;
  };
  MockPostReactions.displayName = 'MockPostReactions';
  return MockPostReactions;
});

jest.mock('./Post.css', () => ({}));

describe('Post Component', () => {
  const mockPost: PostInterface = {
    id: 1,
    content: 'Test post content',
    authorId: 123,
    title: 'Test Title',
    creationDate: '2024-01-01',
    modifiedDate: '2024-01-01',
    likesCount: 0,
    commentsCount: 0,
  };

  beforeEach(() => {
    personShortInfoProps = null;
    postReactionsProps = null;
  });

  it('renders post with content', () => {
    render(<Post {...mockPost} />);

    expect(screen.getByText('Test post content')).toBeInTheDocument();
    expect(screen.getByTestId('person-short-info')).toBeInTheDocument();
    expect(screen.getByTestId('post-reactions')).toBeInTheDocument();
  });

  it('passes correct props to child components', () => {
    render(<Post {...mockPost} />);

    expect(personShortInfoProps).toEqual({
      itemId: 123,
      avatarClassName: 'post-avatar',
    });

    expect(postReactionsProps).toEqual({
      postId: 1,
    });
  });

  it('renders image when provided', () => {
    const postWithImage = {
      ...mockPost,
      image: 'test-image.jpg',
    };

    render(<Post {...postWithImage} />);

    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test-image.jpg');
    expect(image).toHaveClass('post-img');
  });

  it('does not render image when not provided', () => {
    render(<Post {...mockPost} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
