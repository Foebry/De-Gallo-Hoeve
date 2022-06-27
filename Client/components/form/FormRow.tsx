import React, { ReactNode } from "react";

interface FormRowProps {
  children: ReactNode[] | ReactNode;
  className?: string;
}

const FormRow: React.FC<FormRowProps> = ({ children, className = "" }) => {
  return <div className={`${className} flex justify-between`}>{children}</div>;
};

export default FormRow;
