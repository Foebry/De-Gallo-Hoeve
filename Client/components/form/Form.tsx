import React, { Dispatch, ReactNode, SetStateAction } from "react";

export interface FormProps {
  onSubmit: (e: any) => void;
  action?: string;
  children: ReactNode;
  activeStep?: number;
  setActiveStep?: Dispatch<SetStateAction<number>>;
  className?: string;
  errorSteps?: number[];
  steps?: string[];
}

const Form: React.FC<FormProps> = ({
  onSubmit,
  action,
  children,
  className = "",
}) => {
  return (
    <div className="mx-auto relative">
      <form className={`${className} mx-auto`} onSubmit={onSubmit}>
        {children}
        {action && (
          <div className="flex flex-row-reverse">
            <input
              className="capitalize rounded-md py-1 px-2 text-grey-100 text-lg mb-2 bg-green-200 tracking-wide hover:cursor-pointer"
              type="submit"
              value={action}
            />
          </div>
        )}
      </form>
    </div>
  );
};

export default Form;
