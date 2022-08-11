import React, { useState } from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
import Select, { OptionsOrGroups } from "react-select";
import { RegisterErrorInterface } from "../../pages/register";
import Button from "../buttons/Button";
import FormInput from "../form/FormInput";
import FormRow from "../form/FormRow";
import { optionInterface } from "../register/step2";

interface HondCardProps {
  control: Control<FieldValues, any>;
  index: number;
  errors: RegisterErrorInterface;
  setErrors: React.Dispatch<React.SetStateAction<RegisterErrorInterface>>;
  rassen: OptionsOrGroups<any, optionInterface>[];
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
}) => {
  const [active, setActive] = useState<boolean>(true);
  // const geslachten = [
  //   { label: "Reu", value: true },
  //   { label: "Teef", value: false },
  // ];
  return (
    <>
      {active ? (
        <div className="border-2 rounded px-14 relative">
          <div className="absolute right-1 top-2 z-10">
            <Button label="-" onClick={() => setActive(!active)} />
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
            <Controller
              name={`honden.${index}.ras_id`}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  options={rassen}
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
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default HondCard;
