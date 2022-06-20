import React from "react";
import { Controller } from "react-hook-form";
import { DatePicker } from "react-trip-date";
import TimePicker from "react-time-picker";
import Button from "../buttons/Button";
import { FormStepProps } from "../form/FormTabs";

const Step1: React.FC<FormStepProps> = ({ control, setActiveTab }) => {
  return (
    <>
      <Controller
        name="date"
        control={control}
        render={({ field: { onChange } }) => (
          <>
            <TimePicker />
            <DatePicker
              onChange={onChange}
              disabledBeforeToday={true}
              numberOfSelectableDays={1}
              startOfWeek={1}
            />
          </>
        )}
      />
      <Button type="form" label="volgende" onClick={() => setActiveTab(2)} />
    </>
  );
};

export default Step1;
