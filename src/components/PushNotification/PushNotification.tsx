import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import CrossSvg from '../svg/CrossSvg/CrossSvg';
import './PushNotification.css';

interface PushNotificationPropsInterface {
  message: string;
  duration?: number;
}

function PushNotification({ message, duration = 5000 }: PushNotificationPropsInterface) {
  const [isVisible, setIsVisible] = useState(true);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  const targetId = 'push-notification';
  useEffect(() => {
    const element = document.getElementById(targetId);
    setTargetElement(element);
  }, [targetId]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible || !targetElement) return null;

  return createPortal(
    <div className="push-notification-message">
      <p>{message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
        }}
      >
        <CrossSvg className="push-notification-cross" />
      </button>
    </div>,
    targetElement,
  );
}

export default PushNotification;
