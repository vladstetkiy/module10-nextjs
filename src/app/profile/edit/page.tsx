'use client';

import styles from './page.module.css';
import PersonShortInfo from '@/components/PersonShortInfo/PersonShortInfo';
import Input from '@/components/Input/Input';
import MailSvg from '@/components/svg/MailSvg/MailSvg';
import UserSvg from '@/components/svg/UserSvg/UserSvg';
import PenSvg from '@/components/svg/PenSvg/PenSvg';
import Button from '@/components/Button/Button';
import Toggle from '@/components/Toggle/Toggle';
import Link from 'next/link';
import { useThemeStore } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { useNotification } from '@/contexts/NotificationContext/NotificationContext';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import libApi from '@/utils/libApi';
import { useQueryClient } from '@tanstack/react-query';

interface ErrorsInterface {
  email: string;
  username: string;
  description: string;
}

function ProfileInfo() {
  const themeToggle = useThemeStore((state) => state.themeToggle);
  const { logOut } = useAuth();
  const { i18n, t } = useTranslation();
  const { showNotification } = useNotification();
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState<ErrorsInterface>({
    email: '',
    username: '',
    description: '',
  });

  const mutation = `
    mutation UpdateProfile($input: UpdateProfileInput!) {
      updateProfile(input: $input) {
        id
        username
        email
        description
      }
    }
  `;

  const updateProfileMutation = useMutation({
    mutationFn: (profileData: { email: string; description: string; username: string }) =>
      libApi.post('/graphql', {
        query: mutation,
        operationName: 'UpdateProfile',
        variables: {
          input: profileData,
        },
      }),
    onSuccess: () => {
      showNotification(t('updatedProfile'), 5000);
      queryClient.invalidateQueries({
        queryKey: ['me'],
      });
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      showNotification(t('updateProfileError'), 5000);
    },
  });

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ru' : 'en';
    i18n.changeLanguage(newLang);
  };

  const handleUsernameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    validateForm();
    setNewUsername(event.target.value);
  };
  const handleEmailInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    validateForm();
    setNewEmail(event.target.value);
  };
  const handleDescriptionInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    validateForm();
    setNewDescription(event.target.value);
  };

  //this function commented to show how notifications working together

  // const clearForm = () => {
  //   setNewUsername('');
  //   setNewEmail('');
  //   setNewDescription('');
  //   setErrors({
  //     email: '',
  //     username: '',
  //     description: '',
  //   });
  // };

  const validateForm = () => {
    const newErrors = {
      username: '',
      email: '',
      description: '',
    };

    let isValid = true;

    if (!newUsername.trim()) {
      newErrors.username = t('inputUsername');
      isValid = false;
    } else if (newUsername.length < 3) {
      newErrors.username = t('inputUsername');
      isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
      newErrors.username = t('inputUsername');
      isValid = false;
    }

    if (!newEmail.trim()) {
      newErrors.email = t('inputEmail');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      newErrors.email = t('inputValidEmail');
      isValid = false;
    }

    if (newDescription.length > 200) {
      newErrors.description = t('descSize');
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validateResult = validateForm();

    if (validateResult) {
      updateProfileMutation.mutate({
        email: newEmail,
        description: newDescription,
        username: newUsername,
      });
    }

    //this function commented to show how notifications working together

    //clearForm();
  };

  return (
    <main className={styles.profileInfo}>
      <form className={styles.editProfile} onSubmit={handleSubmit}>
        <h2>{t('editProfile')}</h2>
        <PersonShortInfo avatarClassName={styles.profileAvatar} isMe={true} />
        <Input
          inputClassName={styles.usernameInput}
          placeholder="@username123"
          value={newUsername}
          onChange={handleUsernameInputChange}
          svgIconComponent={<UserSvg />}
          title={t('username')}
        />
        {errors.username ? <p className={styles.errorMessage}>{errors.username}</p> : null}
        <Input
          inputClassName={styles.emailInput}
          placeholder="email@domain.com"
          value={newEmail}
          onChange={handleEmailInputChange}
          svgIconComponent={<MailSvg />}
          title={t('email')}
        />
        {errors.email ? <p className={styles.errorMessage}>{errors.email}</p> : null}
        <Input
          inputClassName={styles.descriptionInput}
          placeholder={t('descriptionPlaceholder')}
          value={newDescription}
          onChange={handleDescriptionInputChange}
          svgIconComponent={<PenSvg />}
          title={t('description')}
          additionalInfo={t('maxDescLength')}
        />
        {errors.description ? <p className={styles.errorMessage}>{errors.description}</p> : null}
        <Button
          className={styles.saveChangesButton}
          type="submit"
          disabled={updateProfileMutation.isPending}
        >
          {updateProfileMutation.isPending ? t('saving') : t('saveProfile')}
        </Button>
      </form>
      <div className={styles.secondColumnWrapper}>
        <section className={styles.Preferences}>
          <h2 className=".h2">{t('preferencies')}</h2>
          <Toggle
            visualMode="toggle"
            onToggle={themeToggle}
            isOn={true}
            secondOption={t('darkTheme')}
          />
          <Toggle
            visualMode="toggle"
            onToggle={toggleLanguage}
            isOn={i18n.language !== 'en'}
            secondOption={i18n.language === 'en' ? 'RU' : 'EN'}
          />
        </section>
        <section className={styles.Actions}>
          <h2>{t('actions')}</h2>
          <Link href="/" className={styles.logoutLinkButton}>
            <Button onClick={logOut} className={styles.logoutButton}>
              <p>{t('logout')}</p>
            </Button>
          </Link>
        </section>
      </div>
    </main>
  );
}

export default ProfileInfo;
