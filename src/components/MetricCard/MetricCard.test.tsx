import { render, screen } from '@testing-library/react';
import MetricCard from './MetricCard';

jest.mock('./MetricCard.module.css', () => ({}));

describe('MetricCard Component', () => {
  it('renders with title, value and comment', () => {
    render(<MetricCard cardTitle="Test Title" cardValue={42} valueComment="Test Comment" />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('Test Comment')).toBeInTheDocument();
  });

  it('uses default value when cardValue is not provided', () => {
    render(<MetricCard cardTitle="Test Title" valueComment="Test Comment" />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('accepts string values', () => {
    render(<MetricCard cardTitle="Test Title" cardValue="100+" valueComment="Test Comment" />);

    expect(screen.getByText('100+')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <MetricCard
        cardTitle="Test Title"
        cardValue={42}
        valueComment="Test Comment"
        className="customClass"
      />,
    );

    const section = container.querySelector('section');
    expect(section).toHaveClass('customClass');
  });
});
