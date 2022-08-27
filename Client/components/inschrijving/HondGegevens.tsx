import { nanoid } from "nanoid";
import React from "react";
import {
  Control,
  FieldValues,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { OptionsOrGroups } from "react-select";
import { InschrijvingErrorInterface } from "../../pages/inschrijving";
import DayCard from "../Cards/DayCard";
import { optionInterface } from "../register/HondGegevens";
import { Body } from "../Typography/Typography";

type TrainingType = "prive" | "groep";

interface Props {
  control: Control<FieldValues, any>;
  register: UseFormRegister<FieldValues>;
  errors: InschrijvingErrorInterface;
  setErrors: React.Dispatch<React.SetStateAction<InschrijvingErrorInterface>>;
  rassen: OptionsOrGroups<any, optionInterface>[];
  values: UseFormGetValues<FieldValues>;
  selectedDates: string[];
  honden?: OptionsOrGroups<any, optionInterface>[];
  type: TrainingType;
  handleDelete: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  timeslots: any;
}

const HondGegevens: React.FC<Props> = ({
  control,
  register,
  rassen,
  honden = [],
  selectedDates = [],
  type,
  handleDelete,
  timeslots,
}) => {
  return (
    <>
      {selectedDates.length > 0 ? (
        selectedDates
          // .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
          .map((date: any, index: number) => (
            <DayCard
              key={nanoid(5)}
              date={date}
              control={control}
              register={register}
              options={rassen}
              index={index}
              honden={honden}
              type={type}
              handleDelete={handleDelete}
              timeslots={timeslots[date] ?? timeslots.default}
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

export default HondGegevens;
