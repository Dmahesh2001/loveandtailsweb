import React from 'react';
import './PrimaryButton.css';

const PrimaryButton = ({
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon = null,
  iconPosition = 'right',
  type = 'button',
  className = '',
  ...rest
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={[
        'primary-button',
        `primary-button--${variant}`,
        loading && 'primary-button--loading',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={isDisabled}
      aria-busy={loading}
      {...rest}
    >
      {loading ? (
        <span className="primary-button__spinner" aria-hidden="true" />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="primary-button__icon">{icon}</span>
          )}
          <span className="primary-button__label">{children}</span>
          {icon && iconPosition === 'right' && (
            <span className="primary-button__icon">{icon}</span>
          )}
        </>
      )}
    </button>
  );
};

export default PrimaryButton;
