import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreatePostForm from './CreatePostForm';

jest.mock('./CreatePostForm.module.css', () => ({}));

jest.mock('../Input/Input', () => (props: any) => (
  <input placeholder={props.placeholder} value={props.value} onChange={props.onChange} />
));

jest.mock('../Button/Button', () => (props: any) => (
  <button onClick={props.onClick} type={props.type}>
    {props.children}
  </button>
));

jest.mock('../svg/CrossSvg/CrossSvg', () => () => <div>X</div>);
jest.mock('../svg/MailSvg/MailSvg', () => () => null);
jest.mock('../svg/PenSvg/PenSvg', () => () => null);
jest.mock('../svg/UploadFileSvg/UploadFileSvg', () => () => null);

const mockShowNotification = jest.fn();

jest.mock('@/contexts/NotificationContext/NotificationContext', () => ({
  useNotification: () => ({
    showNotification: mockShowNotification,
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockMutateAsync = jest.fn();

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: jest.fn(),
  }),
  useMutation: () => ({
    mutateAsync: mockMutateAsync,
  }),
}));

jest.mock('@/utils/libApi', () => ({
  post: jest.fn(),
}));

describe('CreatePostForm', () => {
  const closeFunc = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form', () => {
    render(<CreatePostForm closeFunc={closeFunc} />);

    expect(screen.getByText('createNewPost')).toBeInTheDocument();
    expect(screen.getByText('create')).toBeInTheDocument();
  });

  test('calls closeFunc when close button is clicked', () => {
    render(<CreatePostForm closeFunc={closeFunc} />);

    fireEvent.click(screen.getByText('X'));
    expect(closeFunc).toHaveBeenCalled();
  });

  test('shows validation errors on empty submit', async () => {
    render(<CreatePostForm closeFunc={closeFunc} />);

    fireEvent.click(screen.getByText('create'));

    expect(await screen.findByText('inputPostTitle')).toBeInTheDocument();
    expect(await screen.findByText('inputPostDesc')).toBeInTheDocument();
  });

  test('submits form successfully', async () => {
    mockMutateAsync.mockResolvedValueOnce({});

    render(<CreatePostForm closeFunc={closeFunc} />);

    fireEvent.change(screen.getByPlaceholderText('postTitlePlaceholder'), {
      target: { value: 'Valid title' },
    });

    fireEvent.change(screen.getByPlaceholderText('descriptionPlaceholder'), {
      target: { value: 'Valid description text' },
    });

    fireEvent.click(screen.getByText('create'));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalled();
      expect(mockShowNotification).toHaveBeenCalledWith('postCreated', 5000);
      expect(closeFunc).toHaveBeenCalled();
    });
  });
});
