import React from 'react';
import './Button.css';

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
    const classNameCalculate = this.props.className ? this.props.className : '';
    return (
      <button
        type={this.props.type ? this.props.type : 'button'}
        className={`${'orange-button ' + classNameCalculate}`}
        onClick={this.props.onClick}
        disabled={this.props.disabled}
      >
        <p>{this.props.text}</p>
      </button>
    );
  }
}

export default Button;
