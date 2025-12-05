import { render, screen, fireEvent } from '@testing-library/react';
import Input from './Input';
import InfoSvg from '../svg/InfoSvg/InfoSvg';

jest.mock('../svg/InfoSvg/InfoSvg', () => {
  return function MockInfoSvg({ className }: any) {
    return <svg data-testid="info-svg" className={className} />;
  };
});

jest.mock('./input.css', () => ({}));

describe('Input Component', () => {
  const mockOnChange = jest.fn();
  const mockOnBlur = jest.fn();
  const mockSvgIcon = <svg data-testid="test-icon" />;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input with label and icon', () => {
    render(
      <Input
        placeholder="Enter text"
        value=""
        onChange={mockOnChange}
        svgIconComponent={mockSvgIcon}
        title="Username"
      />,
    );

    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('calls onChange when input value changes', () => {
    render(
      <Input
        placeholder="Test"
        value=""
        onChange={mockOnChange}
        svgIconComponent={mockSvgIcon}
        title="Test"
      />,
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('displays additional info when provided', () => {
    render(
      <Input
        placeholder="Test"
        value=""
        onChange={mockOnChange}
        svgIconComponent={mockSvgIcon}
        title="Test"
        additionalInfo="This is help text"
      />,
    );

    expect(screen.getByText('This is help text')).toBeInTheDocument();
    expect(screen.getByTestId('info-svg')).toBeInTheDocument();
  });

  it('does not display additional info when not provided', () => {
    render(
      <Input
        placeholder="Test"
        value=""
        onChange={mockOnChange}
        svgIconComponent={mockSvgIcon}
        title="Test"
      />,
    );

    expect(screen.queryByTestId('info-svg')).not.toBeInTheDocument();
  });

  it('applies custom class names', () => {
    const { container } = render(
      <Input
        wrapperClassName="custom-wrapper"
        inputClassName="custom-input"
        placeholder="Test"
        value=""
        onChange={mockOnChange}
        svgIconComponent={mockSvgIcon}
        title="Test"
      />,
    );

    const wrapper = container.querySelector('.input-wrapper');
    const input = screen.getByRole('textbox');

    expect(wrapper).toHaveClass('custom-wrapper');
    expect(input).toHaveClass('custom-input');
    expect(input).toHaveClass('input-base');
  });

  it('supports different input types', () => {
    render(
      <Input
        placeholder="Test"
        value=""
        onChange={mockOnChange}
        svgIconComponent={mockSvgIcon}
        title="Password"
        type="password"
      />,
    );

    const input = screen.getByPlaceholderText('Test');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('calls onBlur when input loses focus', () => {
    render(
      <Input
        placeholder="Test"
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        svgIconComponent={mockSvgIcon}
        title="Test"
      />,
    );

    const input = screen.getByRole('textbox');
    fireEvent.blur(input);

    expect(mockOnBlur).toHaveBeenCalledTimes(1);
  });

  it('displays current value', () => {
    render(
      <Input
        placeholder="Test"
        value="current value"
        onChange={mockOnChange}
        svgIconComponent={mockSvgIcon}
        title="Test"
      />,
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('current value');
  });
});
