import React, { ReactNode } from 'react';
import styles from './Button.module.css';

type buttonType = 'button' | 'submit' | 'reset' | undefined;

interface PropsInterface {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: buttonType;
  disabled?: boolean;
  isStyleDisabled?: boolean;
  children?: ReactNode;
  'data-testid'?: string;
}

class Button extends React.Component<PropsInterface> {
  constructor(props: PropsInterface) {
    super(props);
  }

  render() {
    const orangeButtonStyle = !this.props.isStyleDisabled ? styles.orangeButton : '';
    return (
      <button
        type={this.props.type ? this.props.type : 'button'}
        className={`${orangeButtonStyle} ${this.props.className}`}
        onClick={this.props.onClick}
        disabled={this.props.disabled}
        data-testid={this.props['data-testid']}
      >
        {this.props.children}
      </button>
    );
  }
}

export default Button;
