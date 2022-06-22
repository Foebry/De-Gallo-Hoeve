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
    <>
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
          />
        )}
      />
      <FormRow>
        <Controller
          name="straat"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="straat"
              name="straat"
              id="straat"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              errors={errors}
              setErrors={setErrors}
            />
          )}
        />
        <Controller
          name="nr"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="nr"
              name="nr"
              id="nr"
              extra="w-1/6"
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
              extra="w-1/6"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              errors={errors}
              setErrors={setErrors}
            />
          )}
        />
      </FormRow>
      <FormRow>
        <Controller
          name="gemeente"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="gemeente"
              name="gemeente"
              id="gemeente"
              extra="w-1/2"
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
              extra="w-1/6"
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
            extra="w-1/2"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            errors={errors}
            setErrors={setErrors}
          />
        )}
      />
      <Button type="form" label="volgende" onClick={() => setActiveTab(2)} />
    </>
  );
};

export default Step1;