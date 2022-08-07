import React from "react";
import Button from "../buttons/Button";
import FormInput from "../form/FormInput";
import FormRow from "../form/FormRow";
import Select, { OptionsOrGroups } from "react-select";
import {
  Control,
  Controller,
  FieldValues,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from "react-hook-form";
import Details from "../Details";
import { DatePicker } from "react-trip-date";
import { FormError } from "../Typography/Typography";
import { InschrijvingErrorInterface } from "../../pages/inschrijving/privelessen";
import {
  RegisterErrorInterface,
  RegisterHondErrorInterface,
} from "../../pages/register";
import HondCard from "../Cards/HondCard";

export interface optionInterface {
  options: [{ value: any; label: string }];
}

interface Step2Props {
  fields: Record<"id", string>[];
  append: UseFieldArrayAppend<FieldValues, "honden">;
  remove: UseFieldArrayRemove;
  options: OptionsOrGroups<any, optionInterface>[];
  control: Control<FieldValues, any>;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  errors: RegisterErrorInterface;
  setErrors: React.Dispatch<React.SetStateAction<RegisterErrorInterface>>;
}

const step2: React.FC<Step2Props> = ({
  setActiveStep,
  control,
  fields,
  append,
  remove,
  options,
  errors,
  setErrors,
}) => {
  const emptyHond = {
    naam: undefined,
    geboortedatum: undefined,
    ras_id: undefined,
    geslacht: undefined,
    chipNr: undefined,
  };

  return (
    <>
      <ul>
        {fields?.map((item: any, index: any) => (
          <li key={item.id} className="relative mb-20">
            <HondCard
              control={control}
              index={index}
              rassen={options}
              errors={errors}
              setErrors={setErrors}
            />
          </li>
        ))}
      </ul>
      <div className="max-w-fit mx-auto">
        <Button
          label={
            fields.length === 0 ? "Nieuwe hond aanmaken" : "Ik heb nog een hond"
          }
          onClick={() => append(emptyHond)}
        />
      </div>
      <FormRow className="mt-40">
        <Button
          label="vorige"
          onClick={() => setActiveStep((activeStep) => activeStep - 1)}
        />
        <Button
          label="volgende"
          onClick={() => {
            setActiveStep((activeStep) => activeStep + 1);
          }}
        />
      </FormRow>
    </>
  );
};

export default step2;
