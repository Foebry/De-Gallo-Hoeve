import { Control, Controller, UseFormGetValues } from 'react-hook-form';
import { FormType } from '../index.page';
import DateRangeSelector from 'src/components/form/inputs/date/DateRangeSelector';
import DateSelector from 'src/components/form/inputs/date/DateSelector';
import { useState } from 'react';

type Props = {
  control: Control<FormType, any>;
  getValues: UseFormGetValues<FormType>;
};

const Details: React.FC<Props> = ({ control, getValues }) => {
  const [defaultNotificationStartDate, setDefaultNotificationStartDate] =
    useState<string>();

  const retrieveStartDate = (_startDate: string) => {
    if (!_startDate) return;
    const startDate = new Date(_startDate);
    const notificationStartDate = startDate.setDate(startDate.getDate() - 14);
    const newDate = new Date(notificationStartDate);
    if (newDate) setDefaultNotificationStartDate(newDate.toISOString().split('T')[0]);
  };

  return (
    <div className="py-10 mx-auto max-w-xl flex flex-col gap-10">
      <div>
        <Controller
          name="duration"
          control={control}
          render={({ field: { value, onChange } }) => (
            <DateRangeSelector
              onChange={onChange}
              value={value}
              retrieveStartDate={retrieveStartDate}
            />
          )}
        />
      </div>
      <div>
        <Controller
          name="notificationStartDate"
          control={control}
          render={({ field: { value, onChange } }) => (
            <DateSelector
              onChange={onChange}
              value={value}
              defaultValue={defaultNotificationStartDate}
              label={'notifcatie start-datum'}
              name={'notificationStartDate'}
              id={'notificationStartDate'}
              disabledAfterDate={getValues().duration?.from}
            />
          )}
        />
      </div>
    </div>
  );
};

export default Details;
