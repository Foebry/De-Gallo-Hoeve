import React, { ReactNode } from 'react';

interface ButtonProps {
  onClick?: (e: React.MouseEvent<any>) => void;
  label: string | ReactNode;
  type?: ButtonTypes;
  className?: string;
  disabled?: boolean;
}

type ButtonTypes = undefined | 'form';

const Button: React.FC<ButtonProps> = ({
  onClick,
  label,
  type,
  className = '',
  disabled = false,
}) => {
  return (
    <span
      className={`${type === 'form' ? 'absolute' : ''} ${className} ${
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      } right-14 bottom-9 capitalize tracking-wide border border-solid rounded py-1 px-1.5 text-gray-100 bg-green-100 border-green-200`}
      onClick={onClick}
    >
      {label}
    </span>
  );
};

export default Button;

export const SubmitButton: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button
      className="capitalize tracking-wide border border-solid rounded-md py-1 px-1.5 text-gray-100 bg-green-100 border-green-200 hover:cursor-pointer"
      onClick={onClick}
    >
      {label}
    </button>
  );
};
