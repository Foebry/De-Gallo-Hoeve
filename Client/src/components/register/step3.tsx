import React from "react";
import FormInput from "../form/FormInput";
import FormRow from "../form/FormRow";
import { Control, Controller, FieldValues } from "react-hook-form";
import { RegisterErrorInterface } from "src/pages/register.page";

interface Step3Props {
  control: Control<FieldValues, any>;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  errors: RegisterErrorInterface;
  setErrors: React.Dispatch<React.SetStateAction<RegisterErrorInterface>>;
}

const step3: React.FC<Step3Props> = ({ control, errors, setErrors }) => {
  return (
    <div className="flex flex-col gap-20 px-28">
      <FormRow className="flex-wrap gap-5">
        <Controller
          name="password"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="wachtwoord"
              name="password"
              id="password"
              extra="w-full 4xs:min-w-2xs sm:w-1/3"
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
              extra="w-full 4xs:min-w-2xs sm:w-1/3"
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
      {/* <SubmitButton type="form" label="Verzend" /> */}
    </div>
  );
};

export default step3;
