import React from "react";
import FormInput from "../../components/form/FormInput";
import FormRow from "../../components/form/FormRow";
import { FormStepProps } from "../../components/form/FormTabs";

const Step1: React.FC<FormStepProps> = ({
  values,
  onChange,
  formErrors,
  setActiveTab,
}) => {
  return (
    <>
      <FormInput
        label="naam"
        name="name"
        id="name"
        type="text"
        value={values.name ?? ""}
        onChange={onChange}
        error={formErrors.name ?? ""}
      />
      <FormInput
        label="voornaam"
        name="firstName"
        id="voornaam"
        type="text"
        value={values.firstName ?? ""}
        onChange={onChange}
        error={formErrors.firstName ?? ""}
      />
      <FormInput
        label="email"
        name="email"
        id="email"
        type="text"
        value={values.email ?? ""}
        onChange={onChange}
        error={formErrors.email ?? ""}
      />
      <FormRow>
        <FormInput
          label="straat"
          name="straat"
          id="straat"
          type="text"
          value={values.straat ?? ""}
          onChange={onChange}
          error={formErrors.straat ?? ""}
        />
        <FormInput
          label="nummer"
          name="nummer"
          id="nummer"
          type="text"
          value={values.nummer ?? ""}
          onChange={onChange}
          error={formErrors.nummer ?? ""}
        />
        <FormInput
          label="bus"
          name="bus"
          id="bus"
          type="text"
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
          type="text"
          value={values.gemeente ?? ""}
          onChange={onChange}
          error={formErrors.gemeente ?? ""}
        />
        <FormInput
          label="postcode"
          name="postcode"
          id="postcode"
          type="text"
          value={values.postcode ?? ""}
          onChange={onChange}
          error={formErrors.postcode ?? ""}
        />
      </FormRow>
      <FormInput
        label="telefoon"
        name="telefoon"
        id="telefoon"
        type="text"
        value={values.telefoon ?? ""}
        onChange={onChange}
        error={formErrors.telefoon ?? ""}
      />
      <input type="submit" value="Volgende" onClick={() => setActiveTab(2)} />
    </>
  );
};

export default Step1;
