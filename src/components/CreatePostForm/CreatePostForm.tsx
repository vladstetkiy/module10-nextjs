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
import { useTranslation } from 'react-i18next';

interface CreatePostFormInterface {
  closeFunc: () => void;
}

interface ErrorsInterface {
  title: string;
  description: string;
  file: string;
}

function CreatePostForm({ closeFunc }: CreatePostFormInterface) {
  const { t } = useTranslation();
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
      newErrors.title = t('inputPostTitle');
      isValid = false;
    } else if (newTitle.length < 3) {
      newErrors.title = t('inputPostTitle');
      isValid = false;
    } else if (newTitle.length > 100) {
      newErrors.title = t('maxTitleLength');
      isValid = false;
    }

    if (!newDescription.trim()) {
      newErrors.description = t('inputPostDesc');
      isValid = false;
    } else if (newDescription.length < 10) {
      newErrors.description = t('inputPostDesc');
      isValid = false;
    } else if (newDescription.length > 500) {
      newErrors.description = t('descSize');
      isValid = false;
    }

    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        newErrors.file = t('fileSizeExceeded');
        isValid = false;
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(selectedFile.type)) {
        newErrors.file = t('invalidFileType');
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
      showNotification(t('postCreated'), 5000);

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
          <h2 className="create-post-form-title">{t('createNewPost')}</h2>
          <button onClick={closeFunc}>
            <CrossSvg className="create-post-form-cross" />
          </button>
        </div>
        <form className="create-post-form" onSubmit={handleSubmit}>
          <Input
            inputClassName="username-input"
            placeholder={t('postTitlePlaceholder')}
            value={newTitle}
            onChange={handleTitleInputChange}
            svgIconComponent={<MailSvg />}
            title={t('postTitle')}
          />
          {errors.title ? <p className="create-post-error-message">{errors.title}</p> : null}

          <Input
            inputClassName="description-input-form"
            placeholder={t('descriptionPlaceholder')}
            value={newDescription}
            onChange={handleDescriptionInputChange}
            svgIconComponent={<PenSvg />}
            title={t('description')}
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
              <p>{t('uploadFile')}</p>
              <p className="additional-info">{t('fileTypes')}</p>
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

          <Button text={t('create')} className="create-post-form-button" type="submit" />
        </form>
      </section>
      <div className="create-post-overlay"></div>
    </>
  );
}

export default CreatePostForm;
