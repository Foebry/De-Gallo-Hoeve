import React, { useEffect } from 'react';
import Button from '../buttons/Button';
import { OptionsOrGroups } from 'react-select';
import {
  Control,
  FieldValues,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormGetValues,
} from 'react-hook-form';
import { RegisterErrorInterface } from 'src/pages/register/index.page';
import HondCard from '../Cards/HondCard';

export interface optionInterface {
  options: [{ value: any; label: string }];
}

interface Props {
  fields: Record<'id', string>[];
  append: UseFieldArrayAppend<FieldValues, 'honden'>;
  remove: UseFieldArrayRemove;
  options: OptionsOrGroups<any, optionInterface>[];
  control: Control<FieldValues, any>;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  errors: RegisterErrorInterface;
  setErrors: React.Dispatch<React.SetStateAction<RegisterErrorInterface>>;
  values: UseFormGetValues<FieldValues>;
}

const HondGegevens: React.FC<Props> = ({
  setActiveStep,
  control,
  fields,
  append,
  remove,
  options,
  errors,
  setErrors,
  values,
}) => {
  const emptyHond = {
    naam: undefined,
    geboortedatum: undefined,
    ras_id: undefined,
    geslacht: undefined,
    chipNr: undefined,
  };

  useEffect(() => {
    values().honden.length === 0 && append(emptyHond);
  }, [values, append, emptyHond]);

  return (
    <div className="md:px-5">
      <ul className="mb-20">
        {fields.map((item: any, index: any) => (
          <li key={item.id} className="relative mb-5">
            <HondCard
              control={control}
              index={index}
              rassen={options}
              errors={errors}
              setErrors={setErrors}
              fields={fields}
              values={values}
              remove={remove}
            />
          </li>
        ))}
      </ul>
      <div className="mb-10 max-w-fit mx-auto">
        <Button label="Ik heb nog een hond" onClick={() => append(emptyHond)} />
      </div>
    </div>
  );
};

export default HondGegevens;
