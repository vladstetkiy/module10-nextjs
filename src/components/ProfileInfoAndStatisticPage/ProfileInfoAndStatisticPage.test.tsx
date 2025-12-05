import { render, screen, fireEvent } from '@testing-library/react';
import ProfileInfoAndStatisticPage from './ProfileInfoAndStatisticPage';
import { useTranslation } from 'react-i18next';
import Toggle from '../Toggle/Toggle';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('../Toggle/Toggle', () => {
  return jest.fn();
});

jest.mock('../ProfileInfo/ProfileInfo', () => {
  return jest.fn(() => <div data-testid="profile-info">ProfileInfo</div>);
});

jest.mock('../Statistic/Statistic', () => {
  return jest.fn(() => <div data-testid="statistic">Statistic</div>);
});

jest.mock('./ProfileInfoAndStatisticPage.css', () => ({}));

const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('ProfileInfoAndStatisticPage Component', () => {
  const mockT = jest.fn((key: string) => key);

  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      t: mockT,
    });

    jest.clearAllMocks();
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();

    (Toggle as jest.Mock).mockImplementation(({ onToggle, isOn, firstOption, secondOption }) => (
      <button data-testid="toggle" onClick={onToggle} data-ison={isOn}>
        {firstOption} / {secondOption}
      </button>
    ));
  });

  it('renders with ProfileInfo by default', () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    render(<ProfileInfoAndStatisticPage />);

    expect(screen.getByTestId('profile-info')).toBeInTheDocument();
    expect(screen.queryByTestId('statistic')).not.toBeInTheDocument();

    expect(mockT).toHaveBeenCalledWith('profileLink');
    expect(mockT).toHaveBeenCalledWith('statsLink');
  });

  it('loads state from localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue('false');

    render(<ProfileInfoAndStatisticPage />);

    expect(screen.getByTestId('statistic')).toBeInTheDocument();
    expect(screen.queryByTestId('profile-info')).not.toBeInTheDocument();
  });

  it('switches between ProfileInfo and Statistic when toggle is clicked', () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    render(<ProfileInfoAndStatisticPage />);

    expect(screen.getByTestId('profile-info')).toBeInTheDocument();
    expect(screen.queryByTestId('statistic')).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId('toggle'));

    expect(screen.getByTestId('statistic')).toBeInTheDocument();
    expect(screen.queryByTestId('profile-info')).not.toBeInTheDocument();

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('isProfileInfo', 'false');
  });

  it('saves state to localStorage when toggling', () => {
    mockLocalStorage.getItem.mockReturnValue('true');

    render(<ProfileInfoAndStatisticPage />);

    fireEvent.click(screen.getByTestId('toggle'));

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('isProfileInfo', 'false');

    fireEvent.click(screen.getByTestId('toggle'));

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('isProfileInfo', 'true');
  });
});
