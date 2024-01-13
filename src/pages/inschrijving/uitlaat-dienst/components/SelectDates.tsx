import React from 'react';
import { Control, UseFormGetValues } from 'react-hook-form';
import { FormType, HandleSelectWeekDayArgs } from '../index.page';
import RecurringData from './recurring/DateSelection';
import NotRecurringDateSelection from './nonRecurring/DateSelection';

type Props = {
  control: Control<FormType, any>;
  getValues: UseFormGetValues<FormType>;
  handleSelectWeekdays: (...args: HandleSelectWeekDayArgs) => void;
  disabledDays: string[];
  ['r-if']: boolean;
};

const SelectDates: React.FC<Props> = ({ disabledDays, control, getValues, handleSelectWeekdays, ['r-if']: rIf }) => {
  const { recurring, period } = getValues();
  const today = new Date().toISOString().split('T')[0];

  return rIf ? (
    <>
      <RecurringData
        control={control}
        selectedPeriod={period}
        handleSelectWeekdays={handleSelectWeekdays}
        r-if={recurring}
      />
      <NotRecurringDateSelection
        r-if={!recurring}
        control={control}
        getValues={getValues}
        disabledDays={[...disabledDays, today]}
      />
    </>
  ) : (
    <></>
  );
};

export default SelectDates;
