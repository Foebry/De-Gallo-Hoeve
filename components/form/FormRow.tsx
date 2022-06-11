import React, { ReactNode } from "react";

interface FormRowProps {
  children: ReactNode[] | ReactNode;
}

const FormRow: React.FC<FormRowProps> = ({ children }) => {
  return <div className="flex gap-7">{children}</div>;
};

export default FormRow;
