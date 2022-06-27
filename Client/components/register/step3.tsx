import React from "react";
import { SubmitButton } from "../buttons/Button";
import FormInput from "../form/FormInput";
import FormRow from "../form/FormRow";
import { Controller } from "react-hook-form";
import { FormStepProps } from "../form/FormTabs";

const step3: React.FC<FormStepProps> = ({ control, errors, setErrors }) => {
  return (
    <div className="flex flex-col gap-20">
      <FormRow className="flex-wrap gap-5">
        <Controller
          name="password"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="wachtwoord"
              name="password"
              id="password"
              extra="w-full 3xs:min-w-2xs sm:w-1/3"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              type="password"
              errors={errors}
              setErrors={setErrors}
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
              extra="w-full 3xs:min-w-2xs sm:w-1/3"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              type="password"
              errors={errors}
              setErrors={setErrors}
            />
          )}
        />
      </FormRow>
      <SubmitButton type="form" label="Verzend" />
    </div>
  );
};

export default step3;
