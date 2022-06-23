import React from "react";

interface ButtonProps {
  onClick?: () => void;
  label: string;
  type?: ButtonTypes;
  className?: string;
}

type ButtonTypes = undefined | "form";

const Button: React.FC<ButtonProps> = ({
  onClick,
  label,
  type,
  className = "",
}) => {
  return (
    <span
      className={`${
        type === "form" ? "absolute" : ""
      } ${className} right-14 bottom-9 capitalize tracking-wide border border-solid rounded-md py-1 px-1.5 text-gray-100 bg-green-100 border-green-200 hover:cursor-pointer hover:border-none`}
      onClick={onClick}
    >
      {label}
    </span>
  );
};

export default Button;

export const SubmitButton: React.FC<ButtonProps> = ({ label }) => {
  return (
    <button className="absolute right-18 bottom-9 capitalize tracking-wide border border-solid rounded-md py-1 px-1.5 text-gray-100 bg-green-100 border-green-200 hover:cursor-pointer hover:border-none">
      {label}
    </button>
  );
};
