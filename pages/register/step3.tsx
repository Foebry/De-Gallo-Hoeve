import React from "react";
import { SubmitButton } from "../../components/buttons/Button";
import FormInput from "../../components/form/FormInput";
import FormRow from "../../components/form/FormRow";
import { Controller } from "react-hook-form";
import { FootNote } from "../../components/Typography/Typography";

interface Props {
  control: any;
  setActiveTab: (e: any) => void;
}

const step3: React.FC<Props> = ({ control }) => {
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
        {<FootNote>errors.postcode</FootNote>}
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
        {<FootNote>errors.naam</FootNote>}
      </FormRow>
      <SubmitButton type="form" label="Verzend" />
    </>
  );
};

export default step3;
