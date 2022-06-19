import React from "react";
import { Controller } from "react-hook-form";
import { DatePicker, RangePicker } from "react-trip-date";
import Button, { SubmitButton } from "../buttons/Button";
import FormInput from "../form/FormInput";
import FormRow from "../form/FormRow";
import { FormStepProps } from "../form/FormTabs";

const Step2: React.FC<FormStepProps> = ({ control, setActiveTab }) => {
  return (
    <>
      <div className="mb-30">
        <Controller
          name="timeframe"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <RangePicker
              onChange={onChange}
              disabledDays={["2022-06-19"]}
              selectedDays={value}
            />
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
