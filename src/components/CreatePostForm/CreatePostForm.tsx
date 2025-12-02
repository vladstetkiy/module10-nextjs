import './CreatePostForm.css';
import Input from '../Input/Input';
import CrossSvg from '../svg/CrossSvg/CrossSvg';
import MailSvg from '../svg/MailSvg/MailSvg';
import PenSvg from '../svg/PenSvg/PenSvg';
import UploadFileSvg from '../svg/UploadFileSvg/UploadFileSvg';
import { useState, useRef } from 'react';
import Button from '../Button/Button';
import { showNotification } from '../../utils/ShowNotification';
import libApi from '@/utils/libApi';

interface CreatePostFormInterface {
  closeFunc: () => void;
}

interface ErrorsInterface {
  title: string;
  description: string;
  file: string;
}

function CreatePostForm({ closeFunc }: CreatePostFormInterface) {
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<ErrorsInterface>({
    title: '',
    description: '',
    file: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTitleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
    validateForm();
  };

  const handleDescriptionInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewDescription(event.target.value);
    validateForm();
  };

  const clearForm = () => {
    setNewTitle('');
    setNewDescription('');
    setSelectedFile(null);
    setErrors({
      title: '',
      description: '',
      file: '',
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors = {
      title: '',
      description: '',
      file: '',
    };

    let isValid = true;

    if (!newTitle.trim()) {
      newErrors.title = 'Post title is required';
      isValid = false;
    } else if (newTitle.length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
      isValid = false;
    } else if (newTitle.length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters';
      isValid = false;
    }

    if (!newDescription.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    } else if (newDescription.length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
      isValid = false;
    } else if (newDescription.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
      isValid = false;
    }

    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        newErrors.file = 'File size must be less than 10MB';
        isValid = false;
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(selectedFile.type)) {
        newErrors.file = 'Only JPG, PNG or PDF files are allowed';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      validateForm();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      validateForm();
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const validateResult = validateForm();

    if (validateResult) {
      showNotification('Post has been created successfully', 5000);

      libApi.post('/posts', {
        title: newTitle,
        description: newDescription,
        image: selectedFile,
      });

      clearForm();
      closeFunc();
    }
  };

  return (
    <>
      <section className="create-post-container">
        <div className="create-post-form-header">
          <h2 className="create-post-form-title">Create a new post</h2>
          <button onClick={closeFunc}>
            <CrossSvg className="create-post-form-cross" />
          </button>
        </div>
        <form className="create-post-form" onSubmit={handleSubmit}>
          <Input
            inputClassName="username-input"
            placeholder="Enter post title"
            value={newTitle}
            onChange={handleTitleInputChange}
            svgIconComponent={<MailSvg />}
            title="Post Title"
          />
          {errors.title ? <p className="create-post-error-message">{errors.title}</p> : null}

          <Input
            inputClassName="description-input-form"
            placeholder="Write description here..."
            value={newDescription}
            onChange={handleDescriptionInputChange}
            svgIconComponent={<PenSvg />}
            title="Description"
          />
          {errors.description ? (
            <p className="create-post-error-message">{errors.description}</p>
          ) : null}

          <div
            className="drag-and-drop-create-post-input"
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <UploadFileSvg className="upload-file-create-post-svg" />
            <div className="info-wrapper">
              <p>Select a file or drag and drop here</p>
              <p className="additional-info">JPG, PNG or PDF, file size no more than 10MB</p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf"
              style={{ display: 'none' }}
            />
          </div>
          {errors.file ? <p className="create-post-error-message">{errors.file}</p> : null}

          <Button text="Create" className="create-post-form-button" type="submit" />
        </form>
      </section>
      <div className="create-post-overlay"></div>
    </>
  );
}

export default CreatePostForm;
