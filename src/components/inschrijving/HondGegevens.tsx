import { TrainingDayDto } from '@/types/DtoTypes/TrainingDto';
import { nanoid } from 'nanoid';
import React from 'react';
import { Control, FieldValues, UseFormGetValues, UseFormRegister } from 'react-hook-form';
import { OptionsOrGroups } from 'react-select';
import { InschrijvingErrorInterface } from 'src/pages/inschrijving/index.page';
import DayCard from '../Cards/DayCard';
import { optionInterface } from '../register/HondGegevens';
import { Body } from '../Typography/Typography';

type TrainingType = 'prive' | 'groep';

interface Props {
  control: Control<FieldValues, any>;
  register: UseFormRegister<FieldValues>;
  errors: InschrijvingErrorInterface;
  setErrors: React.Dispatch<React.SetStateAction<InschrijvingErrorInterface>>;
  rassen: OptionsOrGroups<any, optionInterface>[];
  values: UseFormGetValues<FieldValues>;
  selectedDates: string[];
  honden?: OptionsOrGroups<any, optionInterface>[];
  type: TrainingType;
  handleDelete: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  available: TrainingDayDto[];
}

const HondGegevens: React.FC<Props> = ({
  control,
  register,
  rassen,
  honden = [],
  selectedDates = [],
  type,
  handleDelete,
  available,
  errors,
  setErrors,
}) => {
  const timeslots = available
    .map((trainingDay) => ({
      [trainingDay.date.split('T')[0]]: trainingDay.timeslots.map((timeslot) => ({
        value: timeslot,
        label: timeslot,
      })),
    }))
    .reduce((acc, curr) => ({ ...acc, ...curr }), {});
  return (
    <>
      {selectedDates.length > 0 ? (
        selectedDates
          // .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
          .map((date: any, index: number) => (
            <DayCard
              key={nanoid(5)}
              date={date}
              control={control}
              register={register}
              options={rassen}
              index={index}
              honden={honden}
              type={type}
              errors={errors}
              setErrors={setErrors}
              handleDelete={handleDelete}
              timeslots={timeslots[date]}
              // timeslots={timeslots[date] ?? timeslots.default}
            />
          ))
      ) : (
        <Body className="text-center">
          Gelieve eerst een of meerdere datums aan te duiden.
        </Body>
      )}
    </>
  );
};

export default HondGegevens;
