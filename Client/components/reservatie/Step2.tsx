import React from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
import { RangePicker } from "react-trip-date";
import { ReservatieErrorInterface } from "../../pages/reservatie";
import Button, { SubmitButton } from "../buttons/Button";
import FormRow from "../form/FormRow";
import { Body } from "../Typography/Typography";

interface Step2Props {
  control: Control<FieldValues, any>;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  errors: ReservatieErrorInterface;
  setErrors: React.Dispatch<React.SetStateAction<ReservatieErrorInterface>>;
  disabledDays: string[];
}

const Step2: React.FC<Step2Props> = ({
  control,
  setActiveTab,
  errors,
  setErrors,
  disabledDays,
}) => {
  return (
    <>
      <div className="mb-30">
        <Controller
          name="period"
          control={control}
          render={({ field: { onChange, value } }) => (
            <div>
              <Body className="text-red-700 text-center">
                {errors.medicatie}
              </Body>
              <RangePicker
                onChange={(e) => {
                  setErrors({ ...errors });
                  onChange(e);
                }}
                selectedDays={value}
                startOfWeek={1}
                disabledBeforeToday={true}
                disabledDays={disabledDays}
              />
            </div>
          )}
        />
      </div>
      <FormRow>
        <Button
          className="left-14 right-auto"
          type="form"
          label="vorige"
          onClick={() => setActiveTab(1)}
        />
        <SubmitButton label="reserveer" />
      </FormRow>
    </>
  );
};

export default Step2;
