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
import { RegisterStepProps } from "../form/FormTabs";

export interface optionInterface {
  options: [{ value: any; label: string }];
}

interface Props extends RegisterStepProps {
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
}) => {
  const emptyHond = {
    naam: undefined,
    geboortedatum: undefined,
    ras_id: undefined,
    geslacht: undefined,
    chipNr: undefined,
  };

  const geslachten = [
    { label: "Geslacht", value: undefined },
    { label: "Reu", value: 1 },
    { label: "Teef", value: 0 },
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
                  />
                )}
              />
              <Controller
                name={`honden.${index}.geboortedatum`}
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    label="geboortedatum"
                    name={`honden.${index}.geboortedatum`}
                    id={`honden.${index}.geboortedatum`}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              <Controller
                name={`honden.${index}.ras_id`}
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Select
                    options={options}
                    onChange={onChange}
                    value={value ?? { label: "Ras", value: undefined }}
                  />
                )}
              />
              <FormRow>
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
                  name={`honden.${index}.chipNr`}
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <FormInput
                      label="chipNr"
                      name={`honden.${index}.chipNr`}
                      id={`honden.${index}.chipNr`}
                      extra="w-1/6"
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
              </FormRow>
            </Details>
            <span
              onClick={() => remove(index)}
              className="absolute capitalize tracking-wide border-solid rounded-md py-1 px-1.5 text-gray-100 bg-red-900 border-green-200 hover:cursor-pointer hover:border-none -right-48 bottom-auto top-5"
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
          console.log(fields);
          setActiveTab(3);
        }}
      />
    </>
  );
};

export default step2;
