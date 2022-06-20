import React from "react";
import { Controller } from "react-hook-form";
import { DatePicker } from "react-trip-date";
import Button from "../buttons/Button";
import { FormStepProps } from "../form/FormTabs";

const Step1: React.FC<FormStepProps> = ({
  control,
  setActiveTab,
  disabledDays,
}) => {
  return (
    <>
      <Controller
        name="datum"
        control={control}
        render={({ field: { onChange } }) => (
          <DatePicker
            onChange={onChange}
            disabledBeforeToday={true}
            numberOfSelectableDays={1}
            startOfWeek={1}
            disabledDays={disabledDays}
          />
        )}
      />
      <Button type="form" label="volgende" onClick={() => setActiveTab(2)} />
    </>
  );
};

export default Step1;
