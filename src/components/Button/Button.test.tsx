import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from './Button';

jest.mock('./Button.module.css', () => ({
  orangeButton: 'orangeButton',
}));

describe('Button component', () => {
  test('renders button with children', () => {
    render(<Button data-testid="button">Click me</Button>);

    const button = screen.getByTestId('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
  });

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();

    render(
      <Button data-testid="button" onClick={handleClick}>
        Click
      </Button>,
    );

    fireEvent.click(screen.getByTestId('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('sets button type', () => {
    render(
      <Button data-testid="button" type="submit">
        Submit
      </Button>,
    );

    expect(screen.getByTestId('button')).toHaveAttribute('type', 'submit');
  });

  test('is disabled when disabled=true', () => {
    render(
      <Button data-testid="button" disabled>
        Disabled
      </Button>,
    );

    expect(screen.getByTestId('button')).toBeDisabled();
  });

  test('applies orangeButton style by default', () => {
    render(<Button data-testid="button">Styled</Button>);

    expect(screen.getByTestId('button')).toHaveClass('orangeButton');
  });

  test('does NOT apply orangeButton style when isStyleDisabled=true', () => {
    render(
      <Button data-testid="button" isStyleDisabled>
        No style
      </Button>,
    );

    expect(screen.getByTestId('button')).not.toHaveClass('orangeButton');
  });

  test('adds custom className', () => {
    render(
      <Button data-testid="button" className="custom-class">
        Custom
      </Button>,
    );

    expect(screen.getByTestId('button')).toHaveClass('custom-class');
  });
});
