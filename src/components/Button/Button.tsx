import React from 'react';
import styles from './Button.module.css';

type buttonType = 'button' | 'submit' | 'reset' | undefined;

interface PropsInterface {
  text: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: buttonType;
  disabled?: boolean;
}

class Button extends React.Component<PropsInterface> {
  constructor(props: PropsInterface) {
    super(props);
  }

  render() {
    return (
      <button
        type={this.props.type ? this.props.type : 'button'}
        className={`${styles.orangeButton + ' ' + this.props.className}`}
        onClick={this.props.onClick}
        disabled={this.props.disabled}
      >
        <p>{this.props.text}</p>
      </button>
    );
  }
}

export default Button;
