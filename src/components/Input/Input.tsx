'use client';

import type { ReactElement } from 'react';
import { memo } from 'react';
import InfoSvg from '../svg/InfoSvg/InfoSvg';
import EyeSvg from '../svg/EyeSvg/EyeSvg';
import Button from '../Button/Button';
import { useState } from 'react';
import './input.css';

interface InputPropsInterface {
  wrapperClassName?: string;
  inputClassName?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  svgIconComponent: ReactElement;
  title: string;
  additionalInfo?: string;
  additionInfoTextClassName?: string;
  type?: string;
  onBlur?: () => void;
  onFocus?: () => void;
  dataTestId?: string;
  isAdditionInfoError?: boolean;
  isPassword?: boolean;
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
  dataTestId,
  isAdditionInfoError,
  onFocus,
  isPassword,
}: InputPropsInterface) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  return (
    <div className={'input-wrapper ' + wrapperClassName}>
      <label>
        <div className="title-wrapper">
          {svgIconComponent}
          {title}
        </div>
        <div className="input-container">
          <input
            className={`input-base ${inputClassName} ${isAdditionInfoError ? 'base-error' : ''} `}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            type={isPassword ? (isPasswordVisible ? '' : 'password') : type}
            onBlur={onBlur}
            onFocus={onFocus}
            data-testid={dataTestId}
          />
          {isPassword ? (
            <Button
              isStyleDisabled={true}
              onClick={() => {
                setIsPasswordVisible((prev) => !prev);
              }}
            >
              <EyeSvg className="eye-svg" isCrossed={isPasswordVisible ? false : true} />
            </Button>
          ) : null}
        </div>

        {additionalInfo ? (
          <div className="additional-info-wrapper">
            <InfoSvg className={(isAdditionInfoError ? 'info-svg-error' : '') + ' info-svg'} />
            <p className={(isAdditionInfoError ? 'text-error' : '') + ' additional-info-text'}>
              {additionalInfo}
            </p>
          </div>
        ) : null}
      </label>
    </div>
  );
}

export default memo(Input);
