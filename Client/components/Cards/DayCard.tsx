import React from "react";
import {
  Control,
  Controller,
  FieldValues,
  UseFormRegister,
} from "react-hook-form";
import FormInput from "../form/FormInput";
import Select, { OptionsOrGroups } from "react-select";
import { optionInterface } from "../register/HondGegevens";
import { geslachten } from "./HondCard";
import { Body, Title3 } from "../Typography/Typography";

type TrainingType = "prive" | "groep";

interface DayCardProps {
  onChange?: () => void;
  control: Control<FieldValues, any>;
  register: UseFormRegister<FieldValues>;
  date: any;
  options: OptionsOrGroups<any, optionInterface>[];
  index: number;
  honden?: OptionsOrGroups<any, optionInterface>[];
  type: TrainingType;
}

const DayCard: React.FC<DayCardProps> = ({
  date,
  control,
  options,
  index,
  register,
  honden,
  type,
}) => {
  return (
    <div className="4xs:flex border-2 rounded justify-between 4xs:pr-5 max-w-lg mx-auto mb-2">
      <div className="border-r-2 rounded-l p-10 flex flex-col gap-1 items-center bg-green-200">
        <input
          type="hidden"
          {...register(`inschrijvingen.[${index}].datum`)}
          value={date}
        />
        <span className="text-gray-200">
          {new Date(date)
            .toLocaleString("default", { month: "long" })
            .substring(0, 3)}
        </span>
        <span className="text-gray-200">{date.split("-")[2]}</span>
      </div>
      <div className="py-2 my-auto">
        {honden && honden.length > 0 ? (
          <>
            <div className="text-center mb-8">
              <Body>
                Welke hond neemt u mee naar deze{" "}
                {type === "groep" ? "groepstraining" : "privetraining"}
              </Body>
            </div>
            <Controller
              control={control}
              name={`inschrijvingen.[${index}.hond_id]`}
              render={({ field: { value, onChange } }) => (
                <Select
                  options={honden}
                  value={value ?? { label: "Selecteer hond", key: 0 }}
                  onChange={onChange}
                />
              )}
            />
          </>
        ) : (
          <>
            <Controller
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormInput
                  label={"naam"}
                  name={""}
                  id={""}
                  value={value}
                  onChange={onChange}
                />
              )}
              name={`inschrijvingen.[${index}].naam`}
            />
            <div className="mb-2">
              <Controller
                control={control}
                name={`inschrijvingen.[${index}].ras`}
                render={({ field: { value, onChange } }) => (
                  <Select
                    options={options}
                    onChange={onChange}
                    value={value ?? { key: 0, label: "Selecteer ras" }}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                control={control}
                name={`inschrijvingen.[${index}].geslacht`}
                render={({ field: { value, onChange } }) => (
                  <Select
                    options={geslachten}
                    value={value ?? { key: 0, label: "Selecteer geslacht" }}
                    onChange={onChange}
                  />
                )}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DayCard;
