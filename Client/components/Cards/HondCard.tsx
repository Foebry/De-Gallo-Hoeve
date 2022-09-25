import React, { useState } from "react";
import {
  Control,
  Controller,
  FieldValues,
  UseFieldArrayRemove,
  UseFormGetValues,
} from "react-hook-form";
import Select, { OptionsOrGroups } from "react-select";
import { RegisterErrorInterface } from "../../pages/register";
import Button from "../buttons/Button";
import FormInput from "../form/FormInput";
import FormRow from "../form/FormRow";
import { optionInterface } from "../register/HondGegevens";
import { Body, Title3 } from "../Typography/Typography";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface HondCardProps {
  control: Control<FieldValues, any>;
  index: number;
  errors: RegisterErrorInterface;
  setErrors: React.Dispatch<React.SetStateAction<RegisterErrorInterface>>;
  rassen: OptionsOrGroups<any, optionInterface>[];
  fields: Record<"id", string>[];
  values: UseFormGetValues<FieldValues>;
  remove: UseFieldArrayRemove;
}
export const geslachten = [
  { label: "Reu", value: true },
  { label: "Teef", value: false },
];

const HondCard: React.FC<HondCardProps> = ({
  control,
  index,
  errors,
  setErrors,
  rassen,
  fields,
  values,
  remove,
}) => {
  const [open, setOpen] = useState<boolean>(true);
  console.log({ rassen });
  return (
    <>
      {open ? (
        <div className="border-2 rounded px-2 md:px-20 relative max-w-xl mx-auto">
          <div className="absolute right-1 top-2 z-10">
            <Button label="-" onClick={() => setOpen(!open)} />
          </div>
          <div className="mt-5">
            <Controller
              name={`honden.${index}.naam`}
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <FormInput
                  label="naam"
                  name={`honden.${index}.naam`}
                  id={`honden.${index}.naam`}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  errors={errors}
                  setErrors={setErrors}
                />
              )}
            />
            <FormRow className="mt-5 flex-wrap gap-5 mb-3">
              <div className="w-1/3 min-w-fit">
                <Controller
                  name={`honden.${index}.geslacht`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      options={geslachten}
                      onChange={onChange}
                      value={value ?? { label: "Geslacht *", value: undefined }}
                    />
                  )}
                />
              </div>
              <div className="w-5/12 min-w-fit">
                <Controller
                  name={`honden.${index}.ras`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      options={rassen}
                      onChange={onChange}
                      value={value ?? { label: "Ras", value: undefined }}
                    />
                  )}
                />
              </div>
            </FormRow>
            <Body>Geboortedatum</Body>
            <div className="max-w-fit border-2 rounded mb-5 px-2">
              <Controller
                name={`honden.${index}.geboortedatum`}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    onChange={(e) => {
                      onChange(e);
                      console.log(value);
                    }}
                    selected={value}
                    dateFormat="dd/MM/yyyy"
                  />
                )}
              />
            </div>
          </div>
          <div className="max-w-fit bg-red-800 text-gray-200 mx-auto mb-5">
            <Button label="verwijder" onClick={() => remove(index)} />
          </div>
        </div>
      ) : (
        <div
          className="border-2 rounded py-5 relative max-w-xl mx-auto md:px-20 cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <div className="max-w-fit pl-5">
            <Title3>
              {values().honden[index].naam > ""
                ? values().honden[index].naam
                : "Nieuwe hond"}
            </Title3>
          </div>
          <div className="absolute right-2 top-10 bottom-10">
            <Button label="verwijder" onClick={() => remove(index)} />
          </div>
        </div>
      )}
    </>
  );
};

export default HondCard;
