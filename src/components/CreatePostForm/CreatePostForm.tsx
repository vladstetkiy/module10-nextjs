import styles from './CreatePostForm.module.css';
import Input from '../Input/Input';
import CrossSvg from '../svg/CrossSvg/CrossSvg';
import MailSvg from '../svg/MailSvg/MailSvg';
import PenSvg from '../svg/PenSvg/PenSvg';
import UploadFileSvg from '../svg/UploadFileSvg/UploadFileSvg';
import { useState, useRef } from 'react';
import Button from '../Button/Button';
import { useNotification } from '@/contexts/NotificationContext/NotificationContext';
import libApi from '@/utils/libApi';
import { useTranslation } from 'react-i18next';
import { useQueryClient, useMutation } from '@tanstack/react-query';

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
  const { showNotification } = useNotification();
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<ErrorsInterface>({
    title: '',
    description: '',
    file: '',
  });

  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: async (postData: { title: string; content: string; image: string | null }) => {
      if (postData.image) {
        return libApi.post('/posts', {
          title: postData.title,
          content: postData.content,
          image: postData.image,
        });
      } else {
        return libApi.post('/posts', {
          title: postData.title,
          content: postData.content,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.error('Failed to create Post:', error);
    },
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
      console.log(selectedFile);
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const validateResult = validateForm();
    if (validateResult) {
      await createPostMutation.mutateAsync({
        title: newTitle,
        content: newDescription,
        image: selectedFile ? URL.createObjectURL(selectedFile) : null,
      });
      showNotification(t('postCreated'), 5000);
      clearForm();
      closeFunc();
    }
  };
  return (
    <>
      <section className={styles.createPostContainer}>
        <div className={styles.createPostFormHeader}>
          <h2 className={styles.createPostFormTitle}>{t('createNewPost')}</h2>
          <Button onClick={closeFunc} isStyleDisabled={true}>
            <CrossSvg className={styles.createPostFormCross} />
          </Button>
        </div>
        <form className={styles.createPostForm} onSubmit={handleSubmit}>
          <Input
            inputClassName={styles.usernameInput}
            placeholder={t('postTitlePlaceholder')}
            value={newTitle}
            onChange={handleTitleInputChange}
            svgIconComponent={<MailSvg />}
            title={t('postTitle')}
            additionalInfo={errors.title}
            isAdditionInfoError={!!errors.title}
          />

          <Input
            inputClassName={styles.descriptionInputForm}
            placeholder={t('descriptionPlaceholder')}
            value={newDescription}
            onChange={handleDescriptionInputChange}
            svgIconComponent={<PenSvg />}
            title={t('description')}
            additionalInfo={errors.description}
            isAdditionInfoError={!!errors.description}
          />

          <div
            className={styles.dragAndDropCreatePostInput}
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {!selectedFile ? (
              <>
                {' '}
                <UploadFileSvg className={styles.uploadFileCreatePostSvg} />
                <div className={styles.infoWrapper}>
                  <p>{t('uploadFile')}</p>
                  <p className={styles.additionalInfo}>{t('fileTypes')}</p>
                </div>
              </>
            ) : (
              <img src={URL.createObjectURL(selectedFile)} className={styles.filePreview} />
            )}

            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf"
              style={{ display: 'none' }}
            />
          </div>
          {errors.file ? <p className={styles.createPostErrorMessage}>{errors.file}</p> : null}

          <Button className={styles.createPostFormButton} type="submit">
            {t('create')}
          </Button>
        </form>
      </section>
      <div className={styles.createPostOverlay}></div>
    </>
  );
}

export default CreatePostForm;
