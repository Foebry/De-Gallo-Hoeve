import React from "react";
import Button from "../buttons/Button";
import FormInput from "../form/FormInput";
import FormRow from "../form/FormRow";
import Select, { OptionsOrGroups } from "react-select";
import {
  Controller,
  FieldValues,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from "react-hook-form";
import Details from "../Details";
import { FormStepProps } from "../form/FormTabs";
import { DatePicker } from "react-trip-date";
import { FormError } from "../Typography/Typography";

export interface optionInterface {
  options: [{ value: any; label: string }];
}

interface Props extends FormStepProps {
  fields: Record<"id", string>[];
  append: UseFieldArrayAppend<FieldValues, "honden">;
  remove: UseFieldArrayRemove;
  options: OptionsOrGroups<any, optionInterface>[];
}

const step2: React.FC<Props> = ({
  setActiveTab,
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

  const geslachten = [
    { label: "Reu", value: true },
    { label: "Teef", value: false },
  ];

  return (
    <>
      <ul>
        {fields?.map((item: any, index: any) => (
          <li key={item.id} className="relative mb-20">
            <Details
              summary={
                item.naam === undefined || item.naam === ""
                  ? "nieuwe hond"
                  : item.naam
              }
              button={true}
            >
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
              <Controller
                name={`honden.${index}.ras_id`}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    options={options}
                    onChange={onChange}
                    value={value ?? { label: "Ras", value: undefined }}
                  />
                )}
              />
              <FormRow className="mt-5 flex-wrap gap-5">
                <Controller
                  name={`honden.${index}.geslacht`}
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Select
                      options={geslachten}
                      onChange={onChange}
                      value={value ?? { label: "Geslacht", value: undefined }}
                    />
                  )}
                />
                <Controller
                  name={`honden.${index}.chip_nr`}
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <FormInput
                      label="chipNr"
                      name={`honden.${index}.chip_nr`}
                      id={`honden.${index}.chip_nr`}
                      extra="w-full 3xs:min-w-2xs sm:w-1/2"
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
                name={`honden.${index}.geboortedatum`}
                control={control}
                render={({ field: { onChange, onBlur, value } }) => {
                  const error = errors.geboortedatum ? "text-red-800" : null;
                  return (
                    <Details summary="Geboortedatum" className={error}>
                      <FormError>{errors.geboortedatum}</FormError>
                      <DatePicker
                        onChange={(e) => {
                          setErrors({ ...errors, geboortedatum: undefined });
                          onChange(e);
                        }}
                        startOfWeek={1}
                        numberOfSelectableDays={1}
                      />
                    </Details>
                  );
                }}
              />
            </Details>
            <span
              onClick={() => remove(index)}
              className="absolute capitalize tracking-wide border-solid rounded-md py-1 px-1.5 text-gray-100 bg-red-900 border-green-200 hover:cursor-pointer hover:border-none right-0 -top-10 bottom-auto"
            >
              verwijder
            </span>
          </li>
        ))}
      </ul>
      <FormRow>
        <Button
          label={
            fields.length === 0 ? "Nieuwe hond aanmaken" : "Ik heb nog een hond"
          }
          onClick={() => append(emptyHond)}
        />
      </FormRow>
      <Button
        type="form"
        label="volgende"
        onClick={() => {
          setActiveTab(3);
        }}
      />
    </>
  );
};

export default step2;
