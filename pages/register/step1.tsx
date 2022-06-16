import React from "react";
import FormInput from "../../components/form/FormInput";
import FormRow from "../../components/form/FormRow";
import Button from "../../components/buttons/Button";
import { Controller } from "react-hook-form";
import { FootNote } from "../../components/Typography/Typography";

const Step1 = ({
  control,
  setActiveTab,
}: {
  control: any;
  setActiveTab: (e: any) => void;
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
          />
        )}
      />
      {<FootNote>errors.lnaam</FootNote>}
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
          />
        )}
      />
      {<FootNote>errors.vnaam</FootNote>}
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
          />
        )}
      />
      {<FootNote>errors.email</FootNote>}
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
            />
          )}
        />
        {<FootNote>errors.straat</FootNote>}
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
            />
          )}
        />
        {<FootNote>errors.nr</FootNote>}
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
            />
          )}
        />
        {<FootNote>errors.bus</FootNote>}
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
            />
          )}
        />
        {<FootNote>errors.gemeente</FootNote>}
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
        {<FootNote>errors.postcode</FootNote>}
      </FormRow>
      <Controller
        name="telefoon"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            label="telefoon"
            name="telefoon"
            id="telefoon"
            extra="w-1/2"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
          />
        )}
      />
      {<FootNote>errors.telefoon</FootNote>}
      <Button type="form" label="volgende" onClick={() => setActiveTab(2)} />
    </>
  );
};

export default Step1;
