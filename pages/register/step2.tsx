import React from "react";
import Button from "../../components/buttons/Button";
import FormInput from "../../components/form/FormInput";
import FormRow from "../../components/form/FormRow";
import { FormStepProps } from "../../components/form/FormTabs";

const step2: React.FC<FormStepProps> = ({
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
        value={values.honden?.[0].name ?? ""}
        onChange={onChange}
        error={formErrors.honden?.[0].name ?? ""}
      />
      <FormInput
        label="geboortedatum"
        name="geboortedatum"
        id="geboortedatum"
        type="datetime"
        value={values.honden?.[0].dob ?? ""}
        onChange={onChange}
        error={formErrors.honden?.[0].dob ?? ""}
      />
      <FormRow>
        <FormInput
          label="ras"
          name="ras"
          id="ras"
          type="text"
          value={values.honden?.[0].ras ?? ""}
          onChange={onChange}
          error={formErrors.honden?.[0].ras ?? ""}
        />
        <FormInput
          label="geslacht"
          name="geslacht"
          id="geslacht"
          type="text"
          value={values.honden?.[0].geslacht ?? ""}
          onChange={onChange}
          error={formErrors.honden?.[0].geslacht ?? ""}
        />
      </FormRow>
      <FormRow>
        <FormInput
          label="chipNr"
          name="chipNr"
          id="chipNr"
          type="text"
          value={values.honden?.[0].chipNumber ?? ""}
          onChange={onChange}
          error={formErrors.honden?.[0].chipNumber ?? ""}
        />
        <FormInput
          label={`${
            values.honden?.[0].geslacht === "Reu"
              ? "gecastreerd"
              : "gestereliseerd"
          }`}
          name={`${
            values.honden?.[0].geslacht === "Reu"
              ? "gecastreerd"
              : "gestereliseerd"
          }`}
          id={`${
            values.honden?.[0].geslacht === "Reu"
              ? "gecastreerd"
              : "gestereliseerd"
          }`}
          type="text"
          value={`${
            values.honden?.[0].geslacht === "Reu"
              ? values.honden?.[0].gecastreerd
              : values.honden?.[0].gesteriliseerd
          }`}
          onChange={onChange}
          error={`${
            values.honden?.[0].geslacht === "Reu"
              ? formErrors.honden?.[0].gecastreerd
              : formErrors.honden?.[0].gesteriliseerd
          }`}
        />
      </FormRow>
      <Button label="Volgende" onClick={() => setActiveTab(3)} />
      <input type="submit" value="Ik heb nog een hond" />
    </>
  );
};

export default step2;
