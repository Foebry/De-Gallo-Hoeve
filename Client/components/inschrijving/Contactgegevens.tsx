import React from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
import FormRow from "../form/FormRow";
import Select from "react-select";
import FormInput from "../form/FormInput";

interface ContactProps {
  control: Control<FieldValues, any>;
}

const Contactgegevens: React.FC<ContactProps> = ({ control }) => {
  return (
    <div className="mx-auto max-w-lg">
      <FormRow>
        <div className="max-w-sm relative mb-10">
          <Controller
            name="aanspreking"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Select
                name="aanspreking"
                id="aanspreking"
                value={value ?? { key: 0, label: "Aanspreking" }}
                onChange={onChange}
                options={[
                  { key: undefined, label: "Aanspreking" },
                  { key: 1, label: "Mr." },
                  { key: 2, label: "Mevr." },
                ]}
              />
            )}
          />
        </div>
        <div className="max-w-sm relative">
          <Controller
            name="naam"
            control={control}
            render={({ field: { value, onChange } }) => (
              <FormInput
                name="naam"
                id="naam"
                label="naam"
                value={value}
                onChange={onChange}
              />
            )}
          />
        </div>
      </FormRow>
      <div className="relative">
        <Controller
          name="email"
          control={control}
          render={({ field: { value, onChange } }) => (
            <FormInput
              name="email"
              id="email"
              label="email"
              value={value}
              onChange={onChange}
            />
          )}
        />
      </div>
    </div>
  );
};

export default Contactgegevens;
