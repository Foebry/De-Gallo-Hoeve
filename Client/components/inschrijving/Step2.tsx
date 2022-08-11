import { nanoid } from "nanoid";
import React from "react";
import { Control, FieldValues, UseFormGetValues } from "react-hook-form";
import { OptionsOrGroups } from "react-select";
import { InschrijvingErrorInterface } from "../../pages/inschrijving/privelessen";
import DayCard from "../Cards/DayCard";
import { optionInterface } from "../register/step2";
import { Body } from "../Typography/Typography";

interface Step2Props {
  control: Control<FieldValues, any>;
  errors: InschrijvingErrorInterface;
  setErrors: React.Dispatch<React.SetStateAction<InschrijvingErrorInterface>>;
  rassen: OptionsOrGroups<any, optionInterface>[];
  values: UseFormGetValues<FieldValues>;
  selectedDates: string[];
}

const Step2: React.FC<Step2Props> = ({
  control,
  rassen,
  setErrors,
  errors,
  values,
  selectedDates = [],
}) => {
  return (
    <>
      {selectedDates.length > 0 ? (
        selectedDates.map((date: any) => (
          <DayCard
            key={nanoid(5)}
            date={date}
            control={control}
            options={rassen}
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
