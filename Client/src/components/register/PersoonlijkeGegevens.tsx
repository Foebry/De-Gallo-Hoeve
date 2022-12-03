import React, { Dispatch } from "react";
import FormInput from "../form/FormInput";
import FormRow from "../form/FormRow";
import { Control, Controller, FieldValues } from "react-hook-form";
import { RegisterErrorInterface } from "../../pages/register.page";

interface Step1Props {
  control: Control<FieldValues, any>;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  errors: RegisterErrorInterface;
  setErrors: React.Dispatch<React.SetStateAction<RegisterErrorInterface>>;
  validatePassword: (
    password: string,
    setFormErrors: Dispatch<React.SetStateAction<RegisterErrorInterface>>
  ) => void;
}

const PersoonlijkeGegevens: React.FC<Step1Props> = ({
  control,
  setActiveStep,
  errors,
  setErrors,
  validatePassword,
}) => {
  return (
    <div className="mx-auto px-24">
      <Controller
        name="lnaam"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            label="naam"
            name="lnaam"
            id="lnaam"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            errors={errors}
            setErrors={setErrors}
            extra="4xs:min-w-2xs"
          />
        )}
      />
      <Controller
        name="vnaam"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            label="voornaam"
            name="vnaam"
            id="vnaam"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            errors={errors}
            setErrors={setErrors}
            extra="4xs:min-w-2xs"
          />
        )}
      />
      <Controller
        name="email"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            label="email"
            name="email"
            id="email"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            errors={errors}
            setErrors={setErrors}
            extra="4xs:min-w-2xs"
          />
        )}
      />
      <FormRow className="flex-wrap">
        <Controller
          name="straat"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="straat"
              name="straat"
              id="straat"
              extra="w-full 4xs:min-w-2xs sm:w-1/2"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              errors={errors}
              setErrors={setErrors}
            />
          )}
        />
        <FormRow className="w-full 4xs:min-w-2xs sm:w-1/3 gap-5 flex-wrap">
          <Controller
            name="nr"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label="nr"
                name="nr"
                id="nr"
                extra="w-1/3 min-w-4xs"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                errors={errors}
                setErrors={setErrors}
              />
            )}
          />
          <Controller
            name="bus"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label="bus"
                name="bus"
                id="bus"
                extra="w-1/3 min-w-4xs"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                errors={errors}
                setErrors={setErrors}
              />
            )}
          />
        </FormRow>
      </FormRow>
      <FormRow className="4xs:min-w-2xs flex-wrap gap-5">
        <Controller
          name="gemeente"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="gemeente"
              name="gemeente"
              id="gemeente"
              extra="w-1/2 4xs:min-w-3xs"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              errors={errors}
              setErrors={setErrors}
            />
          )}
        />
        <Controller
          name="postcode"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="postcode"
              name="postcode"
              id="postcode"
              extra="w-1/3 min-w-4xs"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              errors={errors}
              setErrors={setErrors}
            />
          )}
        />
      </FormRow>
      <Controller
        name="gsm"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            label="telefoon"
            name="gsm"
            id="gsm"
            extra="w-full 4xs:min-w-2xs"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            errors={errors}
            setErrors={setErrors}
          />
        )}
      />
      <FormRow>
        <Controller
          name="password"
          control={control}
          render={({ field: { value, onChange } }) => (
            <FormInput
              type="password"
              name="password"
              id="wachtwoord"
              label="wachtwoord"
              value={value}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                validatePassword(e.currentTarget.value, setErrors);
                onChange(e);
              }}
              errors={errors}
              setErrors={setErrors}
            />
          )}
        />
        <Controller
          name="password_verification"
          control={control}
          render={({ field: { value, onChange } }) => (
            <FormInput
              type="password"
              name="password_verification"
              id="wachtwoord"
              label="herhaal wachtwoord"
              value={value}
              onChange={onChange}
              errors={errors}
              setErrors={setErrors}
            />
          )}
        />
      </FormRow>
    </div>
  );
};

export default PersoonlijkeGegevens;
