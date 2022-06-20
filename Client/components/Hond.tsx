import React, { useEffect, useState } from "react";
import { Body, FormError, Title3 } from "./Typography/Typography";
import Select from "react-select";
import FormRow from "./form/FormRow";
import {
  Control,
  Controller,
  FieldValues,
  UseFieldArrayRemove,
} from "react-hook-form";
import Details from "./Details";

interface HondProps {
  naam: string;
  image?: string;
  index: number;
  control: Control<FieldValues, any>;
  remove?: (index: number, id: number) => void;
  id: number;
  avatar: string;
  errors: any;
  setErrors: any;
  boeking?: boolean;
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
  errors,
  setErrors,
  boeking,
}) => {
  return (
    <div className="border-solid border-2 border-black-100 rounded px-2 py-4 my-2">
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
          {boeking ? (
            <span
              onClick={() => remove?.(index, id)}
              className="capitalize tracking-wide border-solid rounded-md py-1 px-1.5 text-gray-100 bg-red-900 border-green-200 hover:cursor-pointer hover:border-none"
            >
              verwijder
            </span>
          ) : (
            <Controller
              name="hond_id"
              control={control}
              render={({ field: { value, onChange } }) => (
                <input
                  className="w-10"
                  name="hond_id"
                  type="radio"
                  onChange={onChange}
                  value={id}
                />
              )}
            />
          )}
        </div>
      </div>
      <div>
        {boeking && (
          <>
            <div className="text-center">
              <Body>Gelieve nog wat bijkomende informatie te verlenen</Body>
            </div>
            <FormRow>
              <Controller
                name={`details.${index}.medicatie`}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <div className="relative">
                    <Select
                      options={options}
                      onChange={(e) => {
                        setErrors({
                          ...errors,
                          medicatie: undefined,
                        });
                        onChange(e);
                      }}
                      value={value ?? { label: "medicatie?", value: undefined }}
                    />
                    <FormError>{errors.medicatie}</FormError>
                  </div>
                )}
              />
              <Controller
                name={`details.${index}.ontsnapping`}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <div className="relative">
                    <Select
                      options={options}
                      onChange={(e) => {
                        setErrors({
                          ...errors,
                          ontsnapping: undefined,
                        });
                        onChange(e);
                      }}
                      value={
                        value ?? { label: "ontsnapping?", value: undefined }
                      }
                    />
                    <FormError>{errors.ontsnapping}</FormError>
                  </div>
                )}
              />
              <Controller
                name={`details.${index}.sociaal`}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <div className="relative">
                    <Select
                      options={options}
                      onChange={(e) => {
                        setErrors({
                          ...errors,
                          sociaal: undefined,
                        });
                        onChange(e);
                      }}
                      value={value ?? { label: "sociaal?", value: undefined }}
                    />
                    <FormError>{errors.sociaal}</FormError>
                  </div>
                )}
              />
            </FormRow>
          </>
        )}
      </div>
    </div>
  );
};

export default Hond;
