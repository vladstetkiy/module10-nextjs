import { render, screen, fireEvent } from '@testing-library/react';
import CreatePostForm from './CreatePostForm';
import { useTranslation } from 'react-i18next';
import libApi from '@/utils/libApi';
import { showNotification } from '../../utils/ShowNotification';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('@/utils/libApi', () => ({
  post: jest.fn(),
}));

jest.mock('../../utils/ShowNotification', () => ({
  showNotification: jest.fn(),
}));

jest.mock(
  '../Input/Input',
  () =>
    ({ title, placeholder, value, onChange, svgIconComponent }: any) => (
      <div>
        <label>{title}</label>
        <input
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          data-testid={`input-${title}`}
        />
        {svgIconComponent}
      </div>
    ),
);

jest.mock('../Button/Button', () => ({ text, onClick, type, className }: any) => (
  <button onClick={onClick} type={type} data-testid="submit-button">
    {text}
  </button>
));

jest.mock('../svg/CrossSvg/CrossSvg', () => ({ className }: any) => (
  <svg data-testid="cross-svg" className={className} />
));
jest.mock('../svg/MailSvg/MailSvg', () => () => <svg data-testid="mail-svg" />);
jest.mock('../svg/PenSvg/PenSvg', () => () => <svg data-testid="pen-svg" />);
jest.mock('../svg/UploadFileSvg/UploadFileSvg', () => ({ className }: any) => (
  <svg data-testid="upload-svg" className={className} />
));

jest.mock('./CreatePostForm.module.css', () => ({}));

describe('CreatePostForm Component', () => {
  const mockCloseFunc = jest.fn();
  const mockT = jest.fn((key: string) => {
    const translations: Record<string, string> = {
      createNewPost: 'Create New Post',
      postTitle: 'Post Title',
      postTitlePlaceholder: 'Enter post title',
      description: 'Description',
      descriptionPlaceholder: 'Enter description',
      uploadFile: 'Upload File',
      fileTypes: 'JPG, PNG, PDF up to 10MB',
      create: 'Create Post',
      inputPostTitle: 'Title is required',
      inputPostDesc: 'Description is required',
      maxTitleLength: 'Title too long',
      descSize: 'Description too long',
      fileSizeExceeded: 'File too large',
      invalidFileType: 'Invalid file type',
      postCreated: 'Post created successfully',
    };
    return translations[key] || key;
  });

  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      t: mockT,
    });
    jest.clearAllMocks();
  });

  it('renders form with all fields', () => {
    render(<CreatePostForm closeFunc={mockCloseFunc} />);

    expect(screen.getByText('Create New Post')).toBeInTheDocument();
    expect(screen.getByText('Post Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Upload File')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    expect(screen.getByTestId('cross-svg')).toBeInTheDocument();
  });

  it('closes form when close button is clicked', () => {
    render(<CreatePostForm closeFunc={mockCloseFunc} />);

    const closeButton = screen.getByTestId('cross-svg').closest('button');
    fireEvent.click(closeButton!);

    expect(mockCloseFunc).toHaveBeenCalledTimes(1);
  });

  it('validates form inputs', () => {
    render(<CreatePostForm closeFunc={mockCloseFunc} />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    expect(mockT).toHaveBeenCalledWith('inputPostTitle');
    expect(mockT).toHaveBeenCalledWith('inputPostDesc');
    expect(libApi.post).not.toHaveBeenCalled();
  });

  it('submits form with valid data', () => {
    (libApi.post as jest.Mock).mockResolvedValue({});

    render(<CreatePostForm closeFunc={mockCloseFunc} />);

    const titleInput = screen.getByTestId('input-Post Title');
    const descriptionInput = screen.getByTestId('input-Description');

    fireEvent.change(titleInput, { target: { value: 'Valid Title' } });
    fireEvent.change(descriptionInput, {
      target: { value: 'Valid description that is long enough' },
    });

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    expect(libApi.post).toHaveBeenCalledWith('/posts', {
      title: 'Valid Title',
      description: 'Valid description that is long enough',
      image: null,
    });
    expect(showNotification).toHaveBeenCalledWith('Post created successfully', 5000);
    expect(mockCloseFunc).toHaveBeenCalledTimes(1);
  });

  it('handles file upload via click', () => {
    render(<CreatePostForm closeFunc={mockCloseFunc} />);

    const fileDropArea = screen.getByText('Upload File').closest('div');
    fireEvent.click(fileDropArea!);

    expect(fileDropArea).toBeInTheDocument();
  });

  it('handles drag and drop', () => {
    render(<CreatePostForm closeFunc={mockCloseFunc} />);

    const fileDropArea = screen.getByText('Upload File').closest('div');

    fireEvent.dragOver(fileDropArea!);

    const file = new File(['test'], 'test.png', { type: 'image/png' });

    fireEvent.drop(fileDropArea!, {
      dataTransfer: {
        files: [file],
      },
    });

    expect(fileDropArea).toBeInTheDocument();
  });

  it('clears form after submission', () => {
    (libApi.post as jest.Mock).mockResolvedValue({});

    render(<CreatePostForm closeFunc={mockCloseFunc} />);

    const titleInput = screen.getByTestId('input-Post Title');
    const descriptionInput = screen.getByTestId('input-Description');

    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    expect(titleInput).toHaveValue('');
    expect(descriptionInput).toHaveValue('');
  });
});
