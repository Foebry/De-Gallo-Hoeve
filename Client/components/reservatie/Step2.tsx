import React from "react";
import { Controller } from "react-hook-form";
import { RangePicker } from "react-trip-date";
import Button, { SubmitButton } from "../buttons/Button";
import FormRow from "../form/FormRow";
import { FormStepProps } from "../form/FormTabs";
import { Body } from "../Typography/Typography";

const Step2: React.FC<FormStepProps> = ({
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
              <Body className="text-red-700 text-center">{errors.period}</Body>
              <RangePicker
                onChange={(e) => {
                  setErrors({ ...errors, period: undefined });
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
