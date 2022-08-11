import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import FormInput from "../form/FormInput";
import { Body, Title3 } from "../Typography/Typography";
import Select, { OptionsOrGroups } from "react-select";
import { optionInterface } from "../register/step2";
import { geslachten } from "./HondCard";

interface DayCardProps {
  onChange?: () => void;
  control: any;
  date: any;
  options: OptionsOrGroups<any, optionInterface>[];
}

const DayCard: React.FC<DayCardProps> = ({ date, control, options }) => {
  return (
    <div className="flex border-2 rounded justify-between pr-5 max-w-lg mx-auto mb-2">
      <div className="border-r-2 rounded-l p-10 flex flex-col gap-1 items-center bg-green-200">
        <span className="text-gray-200">
          {new Date(date)
            .toLocaleString("default", { month: "long" })
            .substring(0, 3)}
        </span>
        <span className="text-gray-200">{date.split("-")[2]}</span>
      </div>
      <div className="py-2">
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
          name={"naam"}
        />
        <div className="mb-2">
          <Controller
            control={control}
            name="ras"
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
            name="geslacht"
            render={({ field: { value, onChange } }) => (
              <Select
                options={geslachten}
                value={value ?? { key: 0, label: "Selecteer geslacht" }}
                onChange={onChange}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default DayCard;
