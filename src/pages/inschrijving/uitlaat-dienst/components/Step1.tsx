import React from 'react';
import { DatePicker } from 'react-trip-date';
import { Controller, Control } from 'react-hook-form';
import { FormType } from '../index.page';
import { getCurrentTime } from 'src/common/api/shared/functions';

type Props = {
  control: Control<FormType, any>;
};

const Step1: React.FC<Props> = ({ control }) => {
  const today = getCurrentTime().toISOString().split('T')[0];
  const in2Months = new Date(new Date().setMonth(getCurrentTime().getMonth() + 2)).toISOString().split('T')[0];
  return (
    <Controller
      name="dates"
      control={control}
      render={({ field: { value, onChange } }) => (
        <DatePicker
          onChange={onChange}
          selectedDays={value}
          disabledBeforeToday={true}
          disabledDays={[today]}
          disabledAfterDate={in2Months}
        />
      )}
    />
  );
};

export default Step1;
