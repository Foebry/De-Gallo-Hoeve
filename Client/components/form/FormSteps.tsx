import React from "react";

interface FormStepsProps {
  steps: string[];
  activeStep: number;
  errorSteps: number[];
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

const FormSteps: React.FC<FormStepsProps> = ({
  steps,
  activeStep,
  errorSteps,
  setActiveStep,
}) => {
  return (
    <div className="w-8/12 mx-auto formstep_bullets">
      <div className="flex justify-between formsteps">
        {steps.map((step, index) => {
          const extra = errorSteps.includes(index)
            ? "error"
            : index <= activeStep
            ? "active"
            : "";
          return (
            <div
              className={`w-full text-center flex flex-col justify-between formstep ${extra}`}
            >
              <p
                className="cursor-pointer"
                onClick={() => setActiveStep(index)}
              >
                {step}
              </p>
              <span
                className="block formstep_bullet mx-auto cursor-pointer"
                onClick={() => setActiveStep(index)}
              ></span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FormSteps;
