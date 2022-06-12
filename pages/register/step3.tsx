import React from "react";
import Button from "../../components/buttons/Button";
import FormInput from "../../components/form/FormInput";
import FormRow from "../../components/form/FormRow";
import { FormStepProps } from "../../components/form/FormTabs";

const step3: React.FC<FormStepProps> = ({
  values,
  onChange,
  formErrors,
  setActiveTab,
}) => {
  return (
    <>
      <FormRow>
        <FormInput
          label="postcode"
          name="postcode"
          id="postcode"
          type="text"
          value={values.dierenarts?.postcode ?? ""}
          onChange={onChange}
          error={formErrors.dierenarts?.postcode}
        />
        <FormInput
          label="naam"
          name="naam"
          id="naam"
          type="text"
          value={values.dierenarts?.naam ?? ""}
          onChange={onChange}
          error={formErrors.dierenarts?.naam}
        />
      </FormRow>
      <Button label="Volgende" onClick={() => setActiveTab(4)} />
    </>
  );
};

export default step3;
