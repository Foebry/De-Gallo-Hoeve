import { nanoid } from "nanoid";
import React, { useEffect } from "react";
import {
  Control,
  FieldValues,
  UseFormGetValues,
  UseFormRegister,
} from "react-hook-form";
import { OptionsOrGroups } from "react-select";
import { InschrijvingErrorInterface } from "../../pages/inschrijving/privelessen";
import DayCard from "../Cards/DayCard";
import { optionInterface } from "../register/step2";
import { Body } from "../Typography/Typography";

interface Step2Props {
  control: Control<FieldValues, any>;
  register: UseFormRegister<FieldValues>;
  errors: InschrijvingErrorInterface;
  setErrors: React.Dispatch<React.SetStateAction<InschrijvingErrorInterface>>;
  rassen: OptionsOrGroups<any, optionInterface>[];
  values: UseFormGetValues<FieldValues>;
  selectedDates: string[];
  honden?: OptionsOrGroups<any, optionInterface>[];
}

const Step2: React.FC<Step2Props> = ({
  control,
  register,
  rassen,
  honden = [],
  setErrors,
  errors,
  values,
  selectedDates = [],
}) => {
  return (
    <>
      {selectedDates.length > 0 ? (
        selectedDates
          .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
          .map((date: any, index: number) => (
            <DayCard
              key={nanoid(5)}
              date={date}
              control={control}
              register={register}
              options={rassen}
              index={index}
              honden={honden}
            />
          ))
      ) : (
        <Body className="text-center">
          Gelieve eerst een of meerdere datums aan te duiden.
        </Body>
      )}
    </>
  );
};

export default Step2;
