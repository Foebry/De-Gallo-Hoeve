import React, { Dispatch, ReactNode, SetStateAction } from "react";
import { Title3 } from "../Typography/Typography";
import FormTabs, { FormTabType } from "./FormTabs";

export interface FormProps {
  onSubmit: (e: any) => void;
  action?: string;
  children: ReactNode;
  title?: string;
  formTabs?: boolean;
  activeTab?: FormTabType;
  setActiveTab?: Dispatch<SetStateAction<FormTabType>>;
}

const Form: React.FC<FormProps> = ({
  title,
  onSubmit,
  action,
  children,
  formTabs,
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="w-1/2 h-50vh bg-grey-300 border-grey-900 border-solid border shadow-sm rounded-2xl mx-auto my-32 relative">
      {title && <Title3>{title}</Title3>}
      {formTabs && (
        <FormTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
      <form className="w-1/2 pt-7 mx-auto" onSubmit={onSubmit}>
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
