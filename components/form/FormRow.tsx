import React, { ReactNode } from "react";

interface FormRowProps {
  children: ReactNode[] | ReactNode;
}

const FormRow: React.FC<FormRowProps> = ({ children }) => {
  return <div className="flex justify-between">{children}</div>;
};

export default FormRow;
