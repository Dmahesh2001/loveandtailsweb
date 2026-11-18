import React, { useId } from 'react';
import './InputField.css';

const InputField = ({
  label,
  id,
  error,
  disabled = false,
  className = '',
  ...inputProps
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div
      className={[
        'input-field',
        disabled && 'input-field--disabled',
        error && 'input-field--error',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label && (
        <label className="input-field__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className="input-field__control"
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...inputProps}
      />
      {error && (
        <span className="input-field__error" id={errorId}>
          {error}
        </span>
      )}
    </div>
  );
};

export default InputField;
