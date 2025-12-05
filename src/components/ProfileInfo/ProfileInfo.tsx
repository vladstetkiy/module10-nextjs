'use client';

import './ProfileInfo.css';
import PersonShortInfo from '../PersonShortInfo/PersonShortInfo';
import Input from '../Input/Input';
import MailSvg from '../svg/MailSvg/MailSvg';
import UserSvg from '../svg/UserSvg/UserSvg';
import PenSvg from '../svg/PenSvg/PenSvg';
import Button from '../Button/Button';
import Toggle from '../Toggle/Toggle';
import Link from 'next/link';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { showNotification } from '../../utils/ShowNotification';
import { useTranslation } from 'react-i18next';

interface ErrorsInterface {
  email: string;
  username: string;
  description: string;
}

function ProfileInfo() {
  const { themeToggle } = useTheme();
  const { logOut } = useAuth();
  const { i18n, t } = useTranslation();
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [errors, setErrors] = useState<ErrorsInterface>({
    email: '',
    username: '',
    description: '',
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

  const clearForm = () => {
    setNewUsername('');
    setNewEmail('');
    setNewDescription('');
    setErrors({
      email: '',
      username: '',
      description: '',
    });
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const validateResult = validateForm();

    if (validateResult) {
      showNotification(t('updatedProfile'), 5000);

      const token = localStorage.getItem('authToken');
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

      fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          query: mutation,
          operationName: 'UpdateProfile',
          variables: {
            input: {
              email: newEmail,
              description: newDescription,
              username: newUsername,
            },
          },
        }),
      });
      clearForm();
    }
  };

  return (
    <main className="profile-info">
      <form className="edit-profile">
        <h2>{t('editProfile')}</h2>
        <PersonShortInfo avatarClassName="profile-avatar" isMe={true} />
        <Input
          inputClassName="username-input"
          placeholder="@username123"
          value={newUsername}
          onChange={handleUsernameInputChange}
          svgIconComponent={<UserSvg />}
          title={t('username')}
        />
        {errors.username ? <p className="error-message">{errors.username}</p> : null}
        <Input
          inputClassName="email-input"
          placeholder="email@domain.com"
          value={newEmail}
          onChange={handleEmailInputChange}
          svgIconComponent={<MailSvg />}
          title={t('email')}
        />
        {errors.email ? <p className="error-message">{errors.email}</p> : null}
        <Input
          inputClassName="description-input"
          placeholder={t('descriptionPlaceholder')}
          value={newDescription}
          onChange={handleDescriptionInputChange}
          svgIconComponent={<PenSvg />}
          title={t('description')}
          additionalInfo={t('maxDescLength')}
        />
        {errors.description ? <p className="error-message">{errors.description}</p> : null}
        <Button
          text={t('saveProfile')}
          className="save-changes-button"
          type="submit"
          onClick={handleSubmit}
        />
      </form>
      <div className="second-column-wrapper">
        <section className="Preferences">
          <h2>{t('preferencies')}</h2>
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
        <section className="Actions">
          <h2>{t('actions')}</h2>
          <Link href="/" className="logout-link-button">
            <Button text={t('logout')} onClick={logOut} className="logout-button" />
          </Link>
        </section>
      </div>
    </main>
  );
}

export default ProfileInfo;
