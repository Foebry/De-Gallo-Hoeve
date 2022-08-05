import { nanoid } from "nanoid";
import React from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
import { InschrijvingErrorInterface } from "../../pages/inschrijving/privelessen";
import Button from "../buttons/Button";
import DayCard from "../Cards/DayCard";
import FormRow from "../form/FormRow";
import Session from "../Session";
import { Title3 } from "../Typography/Typography";

export interface Session {
  date: string;
  spots: number;
  subscriptions: number;
  month: string;
}

interface Step1Props {
  sessions: Session[];
  control: Control<FieldValues, any>;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  errors: InschrijvingErrorInterface;
  setErrors: React.Dispatch<React.SetStateAction<InschrijvingErrorInterface>>;
}

const Step1: React.FC<Step1Props> = ({ control, setActiveStep, sessions }) => {
  return (
    <>
      <Title3>Toekomstige trainingmomenten voor {sessions[0]?.month}</Title3>
      <div>
        {sessions.map((session) => (
          <Controller
            key={nanoid(5)}
            name="datum"
            control={control}
            render={({ field: { onChange } }) => (
              <DayCard key={nanoid(5)} {...session} onChange={onChange} />
            )}
          />
        ))}
      </div>
      <FormRow className="mt-8">
        <Button
          type="form"
          label="volgende"
          onClick={() => setActiveStep((activeStep) => activeStep + 1)}
        />
      </FormRow>
    </>
  );
};

export default Step1;
