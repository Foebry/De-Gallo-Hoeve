import React from "react";
import { SubmitButton } from "../buttons/Button";
import FormInput from "../form/FormInput";
import FormRow from "../form/FormRow";
import { Controller } from "react-hook-form";
import { FormStepProps } from "../form/FormTabs";
import { Title3 } from "../Typography/Typography";

const step3: React.FC<FormStepProps> = ({ control }) => {
  return (
    <div className="flex flex-col gap-20">
      <FormRow>
        <Controller
          name="arts_postcode"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="postcode"
              name="arts_postcode"
              id="arts_postcode"
              extra="w-1/6"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        />
        <Controller
          name="arts_naam"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="naam"
              name="arts_naam"
              id="arts_naam"
              extra="w-1/2"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        />
      </FormRow>
      <Title3>Kies een wachtwoord</Title3>
      <FormRow>
        <Controller
          name="password"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="wachtwoord"
              name="password"
              id="password"
              extra="w-1/3"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              type="password"
            />
          )}
        />
        <Controller
          name="password_verification"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="herhaal"
              name="password_verification"
              id="password_verification"
              extra="w-1/3"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              type="password"
            />
          )}
        />
      </FormRow>
      <SubmitButton type="form" label="Verzend" />
    </div>
  );
};

export default step3;
