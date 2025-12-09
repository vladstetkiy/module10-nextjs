import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

jest.mock('./Button.css', () => ({}));

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button text="Click me" />);

    expect(screen.getByText('Click me')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();

    render(<Button text="Click me" onClick={handleClick} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('has default type "button"', () => {
    render(<Button text="Test" />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('accepts custom type prop', () => {
    render(<Button text="Submit" type="submit" />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('applies custom className', () => {
    render(<Button text="Test" className="customClass" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('customClass');
  });

  it('can be disabled', () => {
    render(<Button text="Disabled" disabled={true} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('is enabled by default', () => {
    render(<Button text="Enabled" />);

    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
  });

  it('handles click event with event parameter', () => {
    const handleClick = jest.fn((event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    });

    render(<Button text="Click" onClick={handleClick} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
  });
});
