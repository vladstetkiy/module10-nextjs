import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Toggle from './Toggle';

describe('Toggle component', () => {
  test('renders toggle mode with labels', () => {
    render(<Toggle visualMode="toggle" firstOption="Off" secondOption="On" isOn={false} />);

    expect(screen.getByText('Off')).toBeInTheDocument();
    expect(screen.getByText('On')).toBeInTheDocument();

    const switchElement = screen.getByRole('switch');
    expect(switchElement).not.toBeChecked();
  });

  test('toggle changes state when clicked', () => {
    render(<Toggle visualMode="toggle" firstOption="Off" secondOption="On" isOn={false} />);

    const switchElement = screen.getByRole('switch');
    fireEvent.click(switchElement);

    expect(switchElement).toBeChecked();
  });

  test('calls onToggle callback when switch is clicked', () => {
    const onToggleMock = jest.fn();

    render(<Toggle visualMode="toggle" isOn={false} onToggle={onToggleMock} />);

    fireEvent.click(screen.getByRole('switch'));
    expect(onToggleMock).toHaveBeenCalledTimes(1);
  });

  test('renders segment-control mode with options', () => {
    render(
      <Toggle
        visualMode="segment-control"
        firstOption="Monthly"
        secondOption="Yearly"
        isOnSegment={true}
      />,
    );

    expect(screen.getByText('Monthly')).toBeInTheDocument();
    expect(screen.getByText('Yearly')).toBeInTheDocument();
  });

  test('segment-control calls onToggle when clicked', () => {
    const onToggleMock = jest.fn();

    render(
      <Toggle
        visualMode="segment-control"
        firstOption="A"
        secondOption="B"
        isOnSegment={true}
        onToggle={onToggleMock}
      />,
    );

    fireEvent.click(screen.getByRole('button'));
    expect(onToggleMock).toHaveBeenCalledTimes(1);
  });
});
