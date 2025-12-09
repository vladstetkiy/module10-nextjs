'use client';

import { useEffect, useState } from 'react';
import CrossSvg from '../svg/CrossSvg/CrossSvg';
import styles from './PushNotification.module.css';

interface PushNotificationPropsInterface {
  message: string;
  duration?: number;
  onClose: () => void;
}

function PushNotification({ message, duration = 5000, onClose }: PushNotificationPropsInterface) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className={styles.pushNotificationMessage}>
      <p>{message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
      >
        <CrossSvg className={styles.pushNotificationCross} />
      </button>
    </div>
  );
}

export default PushNotification;
