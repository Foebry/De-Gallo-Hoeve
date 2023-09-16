import React from 'react';
import { Control, UseFormGetValues } from 'react-hook-form';
import { FormType, HandleSelectWeekDayArgs } from '../index.page';
import RecurringData from './RecurringDateSelection';

type Props = {
  control: Control<FormType, any>;
  getValues: UseFormGetValues<FormType>;
  handleSelectWeekdays: (...args: HandleSelectWeekDayArgs) => void;
};

const SelectDates: React.FC<Props> = ({ control, getValues, handleSelectWeekdays }) => {
  const { recurring, period } = getValues();

  return recurring ? (
    <RecurringData control={control} selectedPeriod={period} handleSelectWeekdays={handleSelectWeekdays} />
  ) : (
    <NotRecurringData />
  );
};

const NotRecurringData: React.FC<{}> = ({}) => {
  return <>Not-Recurring</>;
};

export default SelectDates;
