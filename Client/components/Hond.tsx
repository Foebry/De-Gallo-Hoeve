import React, { useEffect, useState } from "react";
import { Body, Title3 } from "./Typography/Typography";
import Select from "react-select";
import FormRow from "./form/FormRow";
import {
  Control,
  Controller,
  FieldValues,
  UseFieldArrayRemove,
} from "react-hook-form";

interface HondProps {
  naam: string;
  image?: string;
  index: number;
  control: Control<FieldValues, any>;
  remove: (index: number, id: number) => void;
  id: number;
  avatar: string;
}
interface OptionInterface {
  value: boolean;
  label: string;
}

const options: OptionInterface[] = [
  { value: false, label: "Nee" },
  { value: true, label: "Ja" },
];

const Hond: React.FC<HondProps> = ({
  naam,
  avatar = "https://loremflickr.com/100/100/hond",
  index,
  control,
  remove,
  id,
}) => {
  useEffect(() => console.log("id in Hond", id));
  return (
    <div className="border-solid border-2 border-black-100 rounded p-2 my-2">
      <div className="flex gap-5 justify-between items-center">
        <div className="w-25 aspect-square">
          <img
            src={avatar}
            alt=""
            className="w-full object-cover aspect-square"
          />
        </div>
        <div>
          <Title3>{naam}</Title3>
        </div>
        <div>
          <span
            onClick={() => remove(index, id)}
            className="capitalize tracking-wide border-solid rounded-md py-1 px-1.5 text-gray-100 bg-red-900 border-green-200 hover:cursor-pointer hover:border-none"
          >
            verwijder
          </span>
        </div>
      </div>
      <div>
        <div className="text-center">
          <Body>Gelieve nog wat bijkomende informatie te verlenen</Body>
        </div>
        <FormRow>
          <Controller
            name={`details.${index}.medicatie`}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                options={options}
                onChange={onChange}
                value={value ?? { label: "medicatie?", value: undefined }}
              />
            )}
          />
          <Controller
            name={`details.${index}.ontsnapping`}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                options={options}
                onChange={onChange}
                value={value ?? { label: "ontsnapping?", value: undefined }}
              />
            )}
          />
          <Controller
            name={`details.${index}.sociaal`}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                options={options}
                onChange={onChange}
                value={value ?? { label: "sociaal?", value: undefined }}
              />
            )}
          />
        </FormRow>
      </div>
    </div>
  );
};

export default Hond;
