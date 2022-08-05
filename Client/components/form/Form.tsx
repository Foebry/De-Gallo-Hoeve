import React, { Dispatch, ReactNode, SetStateAction } from "react";
import FormSteps from "./FormSteps";

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
  activeStep = 0,
  errorSteps = [],
  setActiveStep,
  className = "",
  steps = [],
}) => {
  return (
    <div className="border-2 rounded mx-auto relative">
      {setActiveStep && (
        <FormSteps
          activeStep={activeStep}
          errorSteps={errorSteps}
          steps={steps}
          setActiveStep={setActiveStep}
        />
      )}
      <form className={`${className} pt-7 mx-auto px-20`} onSubmit={onSubmit}>
        {children}
        {action && (
          <div className="flex flex-row-reverse pt-40">
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
