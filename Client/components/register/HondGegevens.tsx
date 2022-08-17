import React, { useEffect, useMemo } from "react";
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
  UseFormGetValues,
} from "react-hook-form";
import Details from "../Details";
import { DatePicker } from "react-trip-date";
import { FormError } from "../Typography/Typography";
import { InschrijvingErrorInterface } from "../../pages/inschrijving";
import {
  RegisterErrorInterface,
  RegisterHondErrorInterface,
} from "../../pages/register";
import HondCard from "../Cards/HondCard";

export interface optionInterface {
  options: [{ value: any; label: string }];
}

interface Props {
  fields: Record<"id", string>[];
  append: UseFieldArrayAppend<FieldValues, "honden">;
  remove: UseFieldArrayRemove;
  options: OptionsOrGroups<any, optionInterface>[];
  control: Control<FieldValues, any>;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  errors: RegisterErrorInterface;
  setErrors: React.Dispatch<React.SetStateAction<RegisterErrorInterface>>;
  values: UseFormGetValues<FieldValues>;
}

const HondGegevens: React.FC<Props> = ({
  setActiveStep,
  control,
  fields,
  append,
  remove,
  options,
  errors,
  setErrors,
  values,
}) => {
  const emptyHond = {
    naam: undefined,
    geboortedatum: undefined,
    ras_id: undefined,
    geslacht: undefined,
    chipNr: undefined,
  };
  const sorted = useMemo(() => {
    return values().honden.reverse();
  }, [values()]);

  useEffect(() => {
    values().honden.length === 0 && append(emptyHond);
  }, []);

  return (
    <div className="md:px-5">
      <ul className="mb-20">
        {sorted.map((item: any, index: any) => (
          <li key={item.id} className="relative mb-5">
            <HondCard
              control={control}
              index={index}
              rassen={options}
              errors={errors}
              setErrors={setErrors}
              fields={fields}
              values={values}
              remove={remove}
            />
          </li>
        ))}
      </ul>
      <div className="mb-10 max-w-fit mx-auto">
        <Button
          label="Nieuwe hond aanmaken"
          onClick={() => append(emptyHond)}
        />
      </div>
    </div>
  );
};

export default HondGegevens;
