import type { ReactElement } from 'react';
import './input.css';
import InfoSvg from '../svg/InfoSvg/InfoSvg';

interface InputPropsInterface {
  wrapperClassName?: string;
  inputClassName?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  svgIconComponent: ReactElement;
  title: string;
  additionalInfo?: string;
  type?: string;
  onBlur?: () => void;
}

function Input({
  wrapperClassName,
  inputClassName,
  placeholder,
  value,
  onChange,
  svgIconComponent,
  title,
  additionalInfo,
  type,
  onBlur,
}: InputPropsInterface) {
  return (
    <div className={'input-wrapper ' + wrapperClassName}>
      <label>
        <div className="title-wrapper">
          {svgIconComponent}
          {title}
        </div>
        <input
          className={inputClassName + ' input-base'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          type={type}
          onBlur={onBlur}
        />
        {additionalInfo ? (
          <div className="additional-info-wrapper">
            {' '}
            <InfoSvg className="additional-info-svg" />
            <p className="additional-info-text">{additionalInfo}</p>
          </div>
        ) : null}
      </label>
    </div>
  );
}

export default Input;
