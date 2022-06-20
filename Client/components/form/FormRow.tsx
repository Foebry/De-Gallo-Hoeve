import React, { ReactNode } from "react";

interface FormRowProps {
  children: ReactNode[] | ReactNode;
  className?: string;
}

const FormRow: React.FC<FormRowProps> = ({ children, className }) => {
  return <div className={`flex justify-between ${className}`}>{children}</div>;
};

export default FormRow;
