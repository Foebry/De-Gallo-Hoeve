import React, { Dispatch, ReactNode, SetStateAction } from "react";
import { FORM_CONTAINER } from "../../types/styleTypes";
import { Title3 } from "../Typography/Typography";
import FormTabs from "./FormTabs";

export interface FormProps {
  onSubmit: (e: any) => void;
  action?: string;
  children: ReactNode;
  title?: string | ReactNode;
  activeTab?: number;
  setActiveTab?: Dispatch<SetStateAction<number>>;
  tabCount?: number | null;
  className?: string;
}

const Form: React.FC<FormProps> = ({
  title,
  onSubmit,
  action,
  children,
  activeTab,
  setActiveTab,
  tabCount,
  className,
}) => {
  return (
    <div className={FORM_CONTAINER}>
      {title && <Title3>{title}</Title3>}
      {tabCount && (
        <FormTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabCount={tabCount}
        />
      )}
      <form className={`${className} w-10/12 pt-7 mx-auto`} onSubmit={onSubmit}>
        {children}
        {action && (
          <input
            className="absolute right-0 bottom-0 capitalize rounded-md py-1 px-2 text-grey-100 text-lg border border-solid border-gray-200 bg-gray-300 tracking-wide hover:cursor-pointer hover:border-none"
            type="submit"
            value={action}
          />
        )}
      </form>
    </div>
  );
};

export default Form;
