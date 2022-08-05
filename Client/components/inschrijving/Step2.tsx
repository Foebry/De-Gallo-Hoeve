import React from "react";
import { Control, FieldValues, UseFormGetValues } from "react-hook-form";
import { InschrijvingErrorInterface } from "../../pages/inschrijving/privelessen";
import Button, { SubmitButton } from "../buttons/Button";
import Hond from "../buttons/RadioButtons/Hond";
import FormRow from "../form/FormRow";

interface Step2Props {
  control: Control<FieldValues, any>;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  errors: InschrijvingErrorInterface;
  setErrors: React.Dispatch<React.SetStateAction<InschrijvingErrorInterface>>;
  honden: any;
  values: UseFormGetValues<FieldValues>;
}

const Step2: React.FC<Step2Props> = ({
  control,
  setActiveStep,
  honden,
  setErrors,
  errors,
  values,
}) => {
  return (
    <>
      {honden.map(({ naam, avatar, id }: any, index: number) => (
        <Hond
          key={id}
          control={control}
          naam={naam}
          index={index}
          avatar={avatar}
          id={id}
          errors={errors}
          setErrors={setErrors}
          values={values}
        />
      ))}
      <FormRow className="mt-20">
        <Button
          type="form"
          className="right-auto"
          label="vorige"
          onClick={() => setActiveStep((activeStep) => activeStep - 1)}
        />
        <SubmitButton label="Aanvragen" />
      </FormRow>
    </>
  );
};

export default Step2;
