import React from 'react';
import { Controller } from 'react-hook-form';
import { DatePicker } from 'react-trip-date';

type Props = {
  control: any;
  getValues: any;
  disabledDays: any[];
  ['r-if']: boolean;
};

const NotRecurringDateSelection: React.FC<Props> = ({ ['r-if']: rIf, control, disabledDays }) => {
  return !rIf ? (
    <></>
  ) : (
    <>
      <Controller
        name="dates"
        control={control}
        render={({ field: { value: selectedDates, onChange } }) => {
          return (
            <DatePicker
              onChange={onChange}
              disabledBeforeToday={true}
              numberOfSelectableDays={5}
              startOfWeek={1}
              disabledDays={disabledDays}
              selectedDays={selectedDates}
              components={{
                titleOfWeek: {
                  titles: ['Zo', 'Ma', 'Di', 'Woe', 'Do', 'Vr', 'Za'],
                },
              }}
            />
          );
        }}
      />
    </>
  );
};

export default NotRecurringDateSelection;
