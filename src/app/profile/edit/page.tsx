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
import { useRef } from 'react';

interface ErrorsInterface {
  email: string;
  username: string;
  description: string;
}

const mutationProfileInfo = `
mutation UpdateProfile($input: UpdateProfileInput!) {
  updateProfile(input: $input) {
    id
    username
    email
    description
  }
}
`;

const mutationProfileImage = `
mutation UpdateProfile($input: UpdateProfileInput!) {
  updateProfile(input: $input) {
    profileImage
  }
}
`;

function ProfileInfo() {
  const profileInfo = localStorage.getItem('personInfo');
  const formattedProfileInfo =
    profileInfo !== 'undefined' && profileInfo
      ? JSON.parse(profileInfo)
      : { username: '', description: '', email: '' };
  const themeToggle = useThemeStore((state) => state.themeToggle);
  const { logOut } = useAuth();
  const { i18n, t } = useTranslation();
  const { showNotification } = useNotification();
  const [newUsername, setNewUsername] = useState(formattedProfileInfo.username);
  const [newEmail, setNewEmail] = useState(formattedProfileInfo.email);
  const [newDescription, setNewDescription] = useState(formattedProfileInfo.description);
  const [isDescriptionInfoVisible, setIsDescriptionInfoVisible] = useState(false);
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState<ErrorsInterface>({
    email: '',
    username: '',
    description: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateProfileMutation = useMutation({
    mutationFn: (profileData: { email: string; description: string; username: string }) =>
      libApi.post('/graphql', {
        query: mutationProfileInfo,
        operationName: 'UpdateProfile',
        variables: {
          input: profileData,
        },
      }),
    onSuccess: (data) => {
      showNotification(t('updatedProfile'), 5000);
      localStorage.setItem('personInfo', {
        ...formattedProfileInfo,
        ...data.updateProfile,
      });
      queryClient.invalidateQueries({
        queryKey: ['me'],
      });
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      showNotification(t('updateProfileError'), 5000);
    },
  });

  const updateProfileImageMutation = useMutation({
    mutationFn: (profileData: { profileImage: string }) =>
      libApi.post('/graphql', {
        query: mutationProfileImage,
        operationName: 'UpdateProfile',
        variables: {
          input: profileData,
        },
      }),
    onSuccess: (data) => {
      console.log(data);
      showNotification(t('updatedProfile'), 5000);
      queryClient.invalidateQueries({
        queryKey: ['me'],
      });
      queryClient.invalidateQueries({
        queryKey: [formattedProfileInfo.id],
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
  };

  const handleDescriptionInputBlur = () => {
    setIsDescriptionInfoVisible(false);
  };

  const handleDescriptionInputFocus = () => {
    setIsDescriptionInfoVisible(true);
  };

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      updateProfileImageMutation.mutateAsync({
        profileImage: URL.createObjectURL(file),
      });
    }
  };

  return (
    <main className={styles.profileInfo}>
      <form className={styles.editProfile} onSubmit={handleSubmit}>
        <h2 className={styles.h2}>{t('editProfile')}</h2>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleProfileImageChange}
          accept=".jpg,.jpeg,.png,.pdf"
          style={{ display: 'none' }}
        />
        <PersonShortInfo
          avatarClassName={styles.profileAvatar}
          isMe={true}
          descriptionText={t('changeProfilePhoto')}
          onClick={handleProfileImageClick}
        />

        <Input
          inputClassName={styles.usernameInput}
          placeholder="@username123"
          value={newUsername}
          onChange={handleUsernameInputChange}
          svgIconComponent={<UserSvg />}
          title={t('username')}
          additionalInfo={errors.username ? errors.username : undefined}
          isAdditionInfoError={errors.username ? true : false}
        />

        <Input
          inputClassName={styles.emailInput}
          placeholder="email@domain.com"
          value={newEmail}
          onChange={handleEmailInputChange}
          svgIconComponent={<MailSvg />}
          title={t('email')}
          additionalInfo={errors.email ? errors.email : undefined}
          isAdditionInfoError={errors.email ? true : false}
        />
        <Input
          inputClassName={styles.descriptionInput}
          placeholder={t('descriptionPlaceholder')}
          value={newDescription}
          onChange={handleDescriptionInputChange}
          svgIconComponent={<PenSvg />}
          title={t('description')}
          additionalInfo={
            isDescriptionInfoVisible
              ? errors.description
                ? t('lengthLimitSurpassed')
                : t('maxDescLength')
              : undefined
          }
          isAdditionInfoError={errors.description ? true : false}
          onBlur={handleDescriptionInputBlur}
          onFocus={handleDescriptionInputFocus}
        />
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
          <h2 className={styles.h2}>{t('preferencies')}</h2>
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
            secondOption={'RU'}
          />
        </section>
        <section className={styles.Actions}>
          <h2 className={styles.h2}>{t('actions')}</h2>
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
