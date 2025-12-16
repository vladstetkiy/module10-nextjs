'use client';

import { useEffect, useState } from 'react';
import CrossSvg from '../svg/CrossSvg/CrossSvg';
import styles from './PushNotification.module.css';
import Button from '../Button/Button';

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
      <Button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        isStyleDisabled={true}
      >
        <CrossSvg className={styles.pushNotificationCross} />
      </Button>
    </div>
  );
}

export default PushNotification;
