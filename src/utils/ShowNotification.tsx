import ReactDOM from 'react-dom/client';
import PushNotification from '../components/PushNotification/PushNotification';

interface NotificationData {
  key: number;
  message: string;
  duration: number;
}

const notifications: NotificationData[] = [];

const notificationRoot = document.createElement('div');
document.body.appendChild(notificationRoot);

const root = ReactDOM.createRoot(notificationRoot);

function renderNotifications() {
  root.render(
    <div className="push-notification-wrapper">
      {notifications.map((notification) => (
        <PushNotification message={notification.message} duration={notification.duration} />
      ))}
    </div>,
  );
}

export function showNotification(message: string, duration = 5000) {
  const key = 33;
  notifications.push({ key, message, duration });
  renderNotifications();
}
