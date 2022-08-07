import { nanoid } from "nanoid";
import React, { useState } from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
import { InschrijvingErrorInterface } from "../../pages/inschrijving/privelessen";
import Button from "../buttons/Button";
import DayCard from "../Cards/DayCard";
import FormRow from "../form/FormRow";
import Session from "../Session";

export interface Session {
  date: string;
  spots: number;
  subscriptions: number;
  month: string;
}

interface Step1Props {
  trainingsmomenten: Session[];
  control: Control<FieldValues, any>;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  errors: InschrijvingErrorInterface;
  setErrors: React.Dispatch<React.SetStateAction<InschrijvingErrorInterface>>;
}

const Step1: React.FC<Step1Props> = ({
  control,
  setActiveStep,
  trainingsmomenten,
}) => {
  const [numberOfTrainings, setNumberOfTrainings] = useState<number>(5);
  const onClick = async () => {
    setNumberOfTrainings((numberOfTrainings) => numberOfTrainings + 5);
  };
  return (
    <>
      <div>
        {trainingsmomenten.slice(0, numberOfTrainings).map((moment) => (
          <Controller
            key={nanoid(5)}
            name="datum"
            control={control}
            render={({ field: { onChange } }) => (
              <DayCard key={nanoid(5)} {...moment} onChange={onChange} />
            )}
          />
        ))}
      </div>
      <div className="flex justify-center">
        <Button label="Meer laden" onClick={onClick} />
      </div>
      <FormRow className="flex-row-reverse">
        <Button
          label="volgende"
          onClick={() => setActiveStep((activeStep) => activeStep + 1)}
        />
      </FormRow>
    </>
  );
};

export default Step1;
