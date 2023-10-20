import React from 'react';
import { Control, UseFormGetValues } from 'react-hook-form';
import { classNames } from 'src/shared/functions';
import { FormType, HandleSelectWeekDayArgs } from '../index.page';
import RecurringData from './recurring/DateSelection';

type Props = {
  control: Control<FormType, any>;
  getValues: UseFormGetValues<FormType>;
  handleSelectWeekdays: (...args: HandleSelectWeekDayArgs) => void;
  ['r-if']: boolean;
};

const SelectDates: React.FC<Props> = ({ control, getValues, handleSelectWeekdays, ['r-if']: rIf }) => {
  const { recurring, period } = getValues();

  return rIf ? (
    <>
      <RecurringData
        control={control}
        selectedPeriod={period}
        handleSelectWeekdays={handleSelectWeekdays}
        r-if={recurring}
      />
      <NotRecurringData r-if={!recurring} />
    </>
  ) : (
    <></>
  );
};

const NotRecurringData: React.FC<{ ['r-if']: boolean }> = ({ ['r-if']: rIf }) => {
  return <div className={classNames({ hidden: !rIf })}>Not-Recurring</div>;
};

export default SelectDates;
