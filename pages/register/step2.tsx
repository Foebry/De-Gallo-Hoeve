import { nanoid } from "nanoid";
import React, { useState } from "react";
import Button from "../../components/buttons/Button";
import FormInput from "../../components/form/FormInput";
import FormRow from "../../components/form/FormRow";
import { FormStepProps } from "../../components/form/FormTabs";

const step2: React.FC<FormStepProps> = ({
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
        value={values.honden?.[0]?.name ?? ""}
        onChange={onChange}
        error={formErrors.honden?.[0].name ?? ""}
        dataid={"0"}
      />
      <FormRow>
        <FormInput
          label="geboortedatum"
          name="dob"
          id="geboortedatum"
          type="datetime"
          extra="w-1-3"
          value={values.honden?.[0]?.dob ?? ""}
          onChange={onChange}
          error={formErrors.honden?.[0].dob ?? ""}
          dataid={"0"}
        />
        <FormInput
          label="ras"
          name="ras"
          id="ras"
          extra="w-1/3"
          value={values.honden?.[0]?.ras ?? ""}
          onChange={onChange}
          error={formErrors.honden?.[0].ras ?? ""}
          dataid={"0"}
        />
      </FormRow>
      <FormRow>
        <FormInput
          label="geslacht"
          name="geslacht"
          id="geslacht"
          extra="w-1/6"
          value={values.honden?.[0]?.geslacht ?? ""}
          onChange={onChange}
          error={formErrors.honden?.[0].geslacht ?? ""}
          dataid={"0"}
        />
        {["Reu", "Teef"].includes(values.honden?.[0]?.geslacht ?? "") && (
          <FormInput
            label={`${
              values.honden?.[0]?.geslacht === "Reu"
                ? "gecastreerd"
                : "stereliseerd"
            }`}
            name={`${
              values.honden?.[0]?.geslacht === "Reu"
                ? "gecastreerd"
                : "gestereliseerd"
            }`}
            id={`${
              values.honden?.[0]?.geslacht === "Reu"
                ? "gecastreerd"
                : "gestereliseerd"
            }`}
            extra="w-1/6"
            value={`${
              values.honden?.[0]?.geslacht === "Reu"
                ? values.honden?.[0]?.gecastreerd
                : values.honden?.[0]?.gesteriliseerd
            }`}
            onChange={onChange}
            error={`${
              values.honden?.[0]?.geslacht === "Reu"
                ? formErrors.honden?.[0].gecastreerd
                : formErrors.honden?.[0].gesteriliseerd
            }`}
            dataid={"0"}
          />
        )}
        <FormInput
          label="chipNr"
          name="chipNumber"
          id="chipNr"
          extra="w-1/6"
          value={values.honden?.[0]?.chipNumber ?? ""}
          onChange={onChange}
          error={formErrors.honden?.[0].chipNumber ?? ""}
          dataid={"0"}
        />
      </FormRow>
      <FormRow>
        <Button label="Ik heb nog een hond" />
      </FormRow>
      {action && (
        <Button
          type="form"
          label="Volgende"
          onClick={() => {
            setActiveTab(3);
          }}
        />
      )}
    </>
  );
};

export default step2;
