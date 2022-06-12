import React from "react";
import { SubmitButton } from "../../components/buttons/Button";
import Details from "../../components/Details";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import { FormStepProps } from "../../components/form/FormTabs";
import FormRow from "../../components/form/FormRow";

const Step4: React.FC<FormStepProps> = ({
  values,
  onChange,
  formErrors,
  setActiveTab,
  handleHondInput,
}) => {
  return (
    <>
      <div className="mb-32">
        <Details summary="Persoonlijke gegevens">
          <Step1
            values={values}
            onChange={onChange}
            formErrors={formErrors}
            setActiveTab={setActiveTab}
          />
        </Details>
        <Details summary="Gegevens viervoeters">
          <Step2
            values={values}
            onChange={handleHondInput ?? onChange}
            formErrors={formErrors}
            setActiveTab={setActiveTab}
          />
        </Details>
        <Details summary="Gegevens dierenarts">
          <Step3
            values={values}
            onChange={onChange}
            formErrors={formErrors}
            setActiveTab={setActiveTab}
          />
        </Details>
      </div>
      <SubmitButton label="Registreer" />
    </>
  );
};

export default Step4;
