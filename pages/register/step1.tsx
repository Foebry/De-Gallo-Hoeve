import React from "react";
import FormInput from "../../components/form/FormInput";
import FormRow from "../../components/form/FormRow";
import { FormStepProps } from "../../components/form/FormTabs";
import Button from "../../components/buttons/Button";

const Step1: React.FC<FormStepProps> = ({
  values,
  onChange,
  formErrors,
  setActiveTab,
  action,
}) => {
  return (
    <>
      <FormInput
        label="naam"
        name="name"
        id="name"
        value={values.name ?? ""}
        onChange={onChange}
        error={formErrors.name ?? ""}
      />
      <FormInput
        label="voornaam"
        name="firstName"
        id="voornaam"
        value={values.firstName ?? ""}
        onChange={onChange}
        error={formErrors.firstName ?? ""}
      />
      <FormInput
        label="email"
        name="email"
        id="email"
        value={values.email ?? ""}
        onChange={onChange}
        error={formErrors.email ?? ""}
      />
      <FormRow>
        <FormInput
          label="straat"
          name="straat"
          id="straat"
          value={values.straat ?? ""}
          onChange={onChange}
          error={formErrors.straat ?? ""}
          extra="w-1/2"
        />
        <FormInput
          label="nr"
          name="nummer"
          id="nummer"
          extra="w-1/6"
          value={values.nummer ?? ""}
          onChange={onChange}
          error={formErrors.nummer ?? ""}
        />
        <FormInput
          label="bus"
          name="bus"
          id="bus"
          extra="w-1/6"
          value={values.bus ?? ""}
          onChange={onChange}
          error={formErrors.bus ?? ""}
        />
      </FormRow>
      <FormRow>
        <FormInput
          label="gemeente"
          name="gemeente"
          id="gemeente"
          extra="w-1/2"
          value={values.gemeente ?? ""}
          onChange={onChange}
          error={formErrors.gemeente ?? ""}
        />
        <FormInput
          label="postcode"
          name="postcode"
          id="postcode"
          extra="w-1/6"
          value={values.postcode ?? ""}
          onChange={onChange}
          error={formErrors.postcode ?? ""}
        />
      </FormRow>
      <FormInput
        label="telefoon"
        name="telefoon"
        id="telefoon"
        extra="w-1/2"
        value={values.telefoon ?? ""}
        onChange={onChange}
        error={formErrors.telefoon ?? ""}
      />
      {action && (
        <Button label="Volgende" onClick={() => setActiveTab(2)} type="form" />
      )}
    </>
  );
};

export default Step1;
