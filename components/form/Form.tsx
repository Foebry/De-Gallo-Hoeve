import React, { ReactNode } from "react";
import { Title2 } from "../Typography/Typography";

export interface LoginInterface {
  email: string;
  password: string;
}

export interface FormProps {
  onSubmit: (e: any) => void;
  action: string;
  children: ReactNode[];
  title?: string;
}

const Form: React.FC<FormProps> = ({ title, onSubmit, action, children }) => {
  return (
    <div className="w-1/2 h-50vh bg-grey-300 border-grey-200 shadow-sm rounded-2xl mx-auto my-32 relative">
      {title && <Title2>{title}</Title2>}
      <form
        className="absolute w-1/2 h-1/2 top-1/4 left-1/4 pt-7p"
        onSubmit={onSubmit}
      >
        {children}
        <input
          className="absolute right-0 bottom-0 capitalize rounded-md py-1 px-2 text-grey-100 text-lg border border-solid border-gray-200 bg-gray-300 tracking-wide hover:cursor-pointer hover:border-none"
          type="submit"
          value={action}
        />
      </form>
    </div>
  );
};

export default Form;
