import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import Toggle from './Toggle';
import { ThemeProvider, createTheme } from '@mui/material';

jest.mock('./Toggle.css', () => ({}));

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('Toggle Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders toggle mode correctly', () => {
    const mockToggle = jest.fn();

    renderWithTheme(
      <Toggle
        isOn={false}
        onToggle={mockToggle}
        visualMode="toggle"
        firstOption="Off"
        secondOption="On"
      />,
    );

    expect(screen.getByText('Off')).toBeInTheDocument();
    expect(screen.getByText('On')).toBeInTheDocument();
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('renders segment-control mode correctly', () => {
    const mockToggle = jest.fn();

    renderWithTheme(
      <Toggle
        isOn={false}
        onToggle={mockToggle}
        visualMode="segment-control"
        firstOption="Table"
        secondOption="Chart"
      />,
    );

    expect(screen.getByText('Table')).toBeInTheDocument();
    expect(screen.getByText('Chart')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('toggles when clicked in toggle mode', () => {
    const mockToggle = jest.fn();

    renderWithTheme(
      <Toggle
        isOn={false}
        onToggle={mockToggle}
        visualMode="toggle"
        firstOption="Off"
        secondOption="On"
      />,
    );

    const switchElement = screen.getByRole('switch');

    expect(switchElement).not.toBeChecked();

    fireEvent.click(switchElement);

    expect(switchElement).toBeChecked();
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it('toggles when clicked in segment-control mode', () => {
    const mockToggle = jest.fn();

    renderWithTheme(
      <Toggle
        isOn={false}
        onToggle={mockToggle}
        visualMode="segment-control"
        firstOption="Table"
        secondOption="Chart"
      />,
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it('shows correct active state based on initial isOn prop in segment-control', () => {
    const mockToggle = jest.fn();

    const { container } = renderWithTheme(
      <Toggle
        isOn={false}
        onToggle={mockToggle}
        visualMode="segment-control"
        firstOption="Table"
        secondOption="Chart"
      />,
    );

    const tableOption = container.querySelector('.first-option');
    const chartOption = container.querySelector('.second-option');

    expect(chartOption).toHaveClass('toggle-on');
    expect(tableOption).not.toHaveClass('toggle-on');
  });

  it('shows correct active state when isOn=true in segment-control', () => {
    const mockToggle = jest.fn();

    const { container } = renderWithTheme(
      <Toggle
        isOn={true}
        onToggle={mockToggle}
        visualMode="segment-control"
        firstOption="Table"
        secondOption="Chart"
      />,
    );

    const tableOption = container.querySelector('.first-option');
    const chartOption = container.querySelector('.second-option');

    expect(tableOption).toHaveClass('toggle-on');
    expect(chartOption).not.toHaveClass('toggle-on');
  });

  it('initial switch state matches isOn prop when true', () => {
    const mockToggle = jest.fn();

    renderWithTheme(<Toggle isOn={true} onToggle={mockToggle} visualMode="toggle" />);

    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('initial switch state matches isOn prop when false', () => {
    const mockToggle = jest.fn();

    renderWithTheme(<Toggle isOn={false} onToggle={mockToggle} visualMode="toggle" />);

    expect(screen.getByRole('switch')).not.toBeChecked();
  });
});
