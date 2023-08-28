import { nanoid } from 'nanoid';
import React from 'react';
import { Control, UseFormGetValues, Controller } from 'react-hook-form';
import InschrijvingCard from '../../inschrijvingCard';
import { FormType } from '../index.page';
// import { Controller } from 'react-hook-form';
import Select from 'react-select';
import { useHondContext } from 'src/context/app/hondContext';
import { useKlantContext } from 'src/context/app/klantContext';
import { useUserContext } from 'src/context/app/UserContext';

type Props = {
  control: Control<FormType, any>;
  getValues: UseFormGetValues<FormType>;
};

const Step2: React.FC<Props> = ({ control, getValues }) => {
  const chosenDates = getValues().dates;
  const { honden } = useUserContext();
  const options = honden.map((hond) => ({
    label: hond.naam,
    key: hond.id,
  }));

  return (
    <div>
      {chosenDates.map((date, index) => (
        <InschrijvingCard key={nanoid()} date={date} index={index}>
          <div>
            <Controller name="dogs" control={control} render={({ field: { value, onChange } }) => <div>hi</div>} />
            <div>Hallo</div>
            <div>Yo</div>
          </div>
        </InschrijvingCard>
      ))}
    </div>
  );
};

export default Step2;
