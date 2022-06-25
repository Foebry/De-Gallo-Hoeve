import React from "react";
import FormInput from "../form/FormInput";
import FormRow from "../form/FormRow";
import Button from "../buttons/Button";
import { Controller } from "react-hook-form";
import { FormStepProps } from "../form/FormTabs";

const Step1: React.FC<FormStepProps> = ({
  control,
  setActiveTab,
  errors,
  setErrors,
}) => {
  return (
    <div className="mx-auto">
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
            extra="3xs:min-w-2xs"
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
            extra="3xs:min-w-2xs"
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
            extra="3xs:min-w-2xs"
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
              extra="w-full 3xs:min-w-2xs sm:w-1/2"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              errors={errors}
              setErrors={setErrors}
            />
          )}
        />
        <FormRow className="w-full 3xs:min-w-2xs sm:w-1/3 gap-5 flex-wrap">
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
      <FormRow className="3xs:min-w-2xs flex-wrap gap-5">
        <Controller
          name="gemeente"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="gemeente"
              name="gemeente"
              id="gemeente"
              extra="w-1/2 3xs:min-w-3xs"
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
            extra="w-full 3xs:min-w-2xs"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            errors={errors}
            setErrors={setErrors}
          />
        )}
      />
      <Button type="form" label="volgende" onClick={() => setActiveTab(2)} />
    </div>
  );
};

export default Step1;
