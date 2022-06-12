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
  action,
}) => {
  return (
    <>
      <FormRow>
        <FormInput
          label="postcode"
          name="arts_postcode"
          id="postcode"
          extra="w-1/6"
          value={values.arts_postcode ?? ""}
          onChange={onChange}
          error={formErrors.arts_postcode}
        />
        <FormInput
          label="naam"
          name="arts_name"
          id="naam"
          extra="w-1/2"
          value={values.arts_name ?? ""}
          onChange={onChange}
          error={formErrors.arts_name}
        />
      </FormRow>
      {action && (
        <Button
          label="Volgende"
          type="form"
          onClick={() => {
            console.log(values);
            setActiveTab(4);
          }}
        />
      )}
    </>
  );
};

export default step3;
