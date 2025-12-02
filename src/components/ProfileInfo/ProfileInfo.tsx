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

interface ErrorsInterface {
  email: string;
  username: string;
  description: string;
}

function ProfileInfo() {
  const { themeToggle } = useTheme();
  const { logOut } = useAuth();
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [errors, setErrors] = useState<ErrorsInterface>({
    email: '',
    username: '',
    description: '',
  });
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
      newErrors.username = 'Username is required';
      isValid = false;
    } else if (newUsername.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long';
      isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
      newErrors.username = 'Username can only contain letters, numbers and underscore';
      isValid = false;
    }

    if (!newEmail.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (newDescription.length > 200) {
      newErrors.description = 'Description cannot exceed 200 characters';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const validateResult = validateForm();

    if (validateResult) {
      showNotification('Profile info has been updated successfully', 5000);

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
        <h2>Edit-profile</h2>
        <PersonShortInfo avatarClassName="profile-avatar" isMe={true} />
        <Input
          inputClassName="username-input"
          placeholder="@username123"
          value={newUsername}
          onChange={handleUsernameInputChange}
          svgIconComponent={<UserSvg />}
          title="Username"
        />
        {errors.username ? <p className="error-message">{errors.username}</p> : null}
        <Input
          inputClassName="email-input"
          placeholder="email@domain.com"
          value={newEmail}
          onChange={handleEmailInputChange}
          svgIconComponent={<MailSvg />}
          title="Email"
        />
        {errors.email ? <p className="error-message">{errors.email}</p> : null}
        <Input
          inputClassName="description-input"
          placeholder="Write description here"
          value={newDescription}
          onChange={handleDescriptionInputChange}
          svgIconComponent={<PenSvg />}
          title="Description"
          additionalInfo="Max 200 chars"
        />
        {errors.description ? <p className="error-message">{errors.description}</p> : null}
        <Button
          text="Save Profile Changes"
          className="save-changes-button"
          type="submit"
          onClick={handleSubmit}
        />
      </form>
      <div className="second-column-wrapper">
        <section className="Preferences">
          <h2>Preferences</h2>
          <Toggle
            visualMode="toggle"
            onToggle={themeToggle}
            isOn={true}
            secondOption="Dark theme"
          />
        </section>
        <section className="Actions">
          <h2>Actions</h2>
          <Link href="/" className="logout-link-button">
            <Button text="Logout" onClick={logOut} className="logout-button" />
          </Link>
        </section>
      </div>
    </main>
  );
}

export default ProfileInfo;
