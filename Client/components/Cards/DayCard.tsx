import React, { ButtonHTMLAttributes } from "react";
import {
  Control,
  Controller,
  FieldValues,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import FormInput from "../form/FormInput";
import Select, { OptionsOrGroups } from "react-select";
import { optionInterface } from "../register/HondGegevens";
import { geslachten } from "./HondCard";
import { Body } from "../Typography/Typography";
import { RiDeleteBin6Line } from "react-icons/ri";

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
  handleDelete: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  error?: boolean;
  timeslots: any;
}

const DayCard: React.FC<DayCardProps> = ({
  date,
  control,
  options,
  index,
  register,
  honden,
  type,
  handleDelete,
  error = false,
  timeslots,
}) => {
  return (
    <div className="4xs:flex border-2 rounded justify-between 4xs:pr-5 max-w-lg mx-auto mb-2 relative items-center">
      <div
        className={`border-r-2 rounded-l p-10 flex flex-col gap-1 items-center ${
          error ? "bg-red-900" : "bg-green-200"
        }`}
      >
        <input
          type="hidden"
          {...register(`inschrijvingen[${index}].datum`)}
          value={date}
        />
        <div className="text-gray-200 flex flex-col items-center">
          <span className="text-gray-200">
            {new Date(date)
              .toLocaleString("default", { month: "long" })
              .substring(0, 3)}
          </span>
          <span className="text-gray-200">{date.split("-")[2]}</span>
        </div>
      </div>
      <div className="py-2 my-auto w-full pl-5">
        {honden && honden.length > 0 ? (
          <div className="flex flex-col gap-2">
            <Controller
              control={control}
              name={`inschrijvingen[${index}].hond_id`}
              render={({ field: { value, onChange } }) => (
                <Select
                  options={honden}
                  value={value ?? { label: "Selecteer hond", key: 0 }}
                  onChange={onChange}
                />
              )}
            />
            <Controller
              control={control}
              name={`inschrijvingen[${index}].tijdslot`}
              render={({ field: { value, onChange } }) => (
                <Select
                  options={timeslots}
                  value={value ?? { label: "Selecteer tijdstip", key: 0 }}
                  onChange={onChange}
                />
              )}
            />
          </div>
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
              name={`inschrijvingen[${index}].naam`}
            />
            <div className="mb-2">
              <Controller
                control={control}
                name={`inschrijvingen[${index}].ras`}
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
                name={`inschrijvingen[${index}].geslacht`}
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
      <div
        className="absolute -right-20 text-3xl text-red-900 cursor-pointer"
        onClick={handleDelete}
        data-id={index}
      >
        <RiDeleteBin6Line className="pointer-events-none" />
      </div>
    </div>
  );
};

export default DayCard;
