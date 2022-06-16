import React from "react";
import { SubmitButton } from "../../components/buttons/Button";
import FormInput from "../../components/form/FormInput";
import FormRow from "../../components/form/FormRow";
import { Controller } from "react-hook-form";
import { FootNote } from "../../components/Typography/Typography";
import { RegisterStepProps } from "../../components/form/FormTabs";

const step3: React.FC<RegisterStepProps> = ({ control }) => {
  return (
    <>
      <FormRow>
        <Controller
          name="postcode"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="postcode"
              name="postcode"
              id="postcode"
              extra="w-1/6"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        />
        <Controller
          name="naam"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="naam"
              name="naam"
              id="naam"
              extra="w-1/2"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        />
      </FormRow>
      <SubmitButton type="form" label="Verzend" />
    </>
  );
};

export default step3;
