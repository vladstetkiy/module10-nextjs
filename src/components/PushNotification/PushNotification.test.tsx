import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PushNotification from './PushNotification';

jest.mock('./PushNotification.css', () => ({}));

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (children: React.ReactNode) => {
    return children as React.ReactPortal;
  },
}));

describe('PushNotification Component', () => {
  beforeEach(() => {
    if (!document.getElementById('push-notification')) {
      const portalElement = document.createElement('div');
      portalElement.id = 'push-notification';
      document.body.appendChild(portalElement);
    }
  });

  afterEach(() => {
    const portalElement = document.getElementById('push-notification');
    if (portalElement && portalElement.parentNode) {
      document.body.removeChild(portalElement);
    }
  });

  it('renders notification with message', () => {
    render(<PushNotification message="Test notification" />);

    expect(screen.getByText('Test notification')).toBeInTheDocument();
  });

  it('closes when close button is clicked', () => {
    render(<PushNotification message="Test notification" />);

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    expect(screen.queryByText('Test notification')).not.toBeInTheDocument();
  });

  it('auto-closes after duration', async () => {
    render(<PushNotification message="Test notification" duration={100} />);

    expect(screen.getByText('Test notification')).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.queryByText('Test notification')).not.toBeInTheDocument();
      },
      { timeout: 200 },
    );
  });
});
