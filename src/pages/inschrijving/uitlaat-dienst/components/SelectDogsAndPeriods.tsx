import { nanoid } from 'nanoid';
import React from 'react';
import { Control, UseFormGetValues, Controller } from 'react-hook-form';
import InschrijvingCard from '../../components/inschrijvingCard';
import { FormType } from '../index.page';
import Select, { MultiValue, OptionsOrGroups } from 'react-select';
import { useUserContext } from 'src/context/app/UserContext';
import { optionInterface } from 'src/components/register/HondGegevens';

type Props = {
  control: Control<FormType, any>;
  selectedWeekDays: string[];
  handleDeleteWeekDays: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  getValues: UseFormGetValues<FormType>;
  handleHondSelect: (e: MultiValue<any>, weekday: string) => MultiValue<any>;
  handleMomentSelect: (e: MultiValue<any>, weekday: string) => MultiValue<any>;
};

const SelectDogsAndPeriods: React.FC<Props> = ({
  control,
  getValues,
  selectedWeekDays,
  handleDeleteWeekDays,
  handleHondSelect,
  handleMomentSelect,
}) => {
  const { recurring, dates, period, weekDays } = getValues();
  const recurringWeekdays = recurring && weekDays;
  const { honden } = useUserContext();

  const weekdayMapper: Record<string, string> = {
    '1': 'Maa',
    '2': 'Di',
    '3': 'Woe',
    '4': 'Do',
    '5': 'Vrij',
    '6': 'Za',
    '0': 'Zo',
  };

  const momentOptions: OptionsOrGroups<any, optionInterface> = [
    {
      value: 'ochtend',
      label: 'Ochtend',
    },
    {
      value: 'middag',
      label: 'Middag',
    },
    {
      value: 'avond',
      label: 'Avond',
    },
  ];

  const hondOptions: OptionsOrGroups<any, optionInterface> = honden.map((hond) => ({
    value: hond.id,
    label: hond.naam,
  }));

  return (
    <div>
      {recurringWeekdays &&
        selectedWeekDays
          .sort((a, b) => (a > b ? 1 : -1))
          .map((weekday, index) => (
            <InschrijvingCard
              key={nanoid()}
              weekday={weekdayMapper[weekday]}
              data-id={weekday}
              index={index}
              onDelete={handleDeleteWeekDays}
            >
              <div className="flex flex-col gap-4">
                <Controller
                  name="dogs"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      options={hondOptions}
                      placeholder={`Selecteer hond(en)...`}
                      isMulti={true}
                      value={value.filter((v) => v.weekday === weekday)[0]?.dogs ?? []}
                      onChange={(e) => onChange(handleHondSelect(e, weekday))}
                    />
                  )}
                />
                <Controller
                  name="moments"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      options={momentOptions}
                      placeholder={`Selecteer moment(en...)`}
                      isMulti={true}
                      value={value.filter((v) => v.weekday === weekday)[0]?.moments ?? []}
                      onChange={(e) => onChange(handleMomentSelect(e, weekday))}
                    />
                  )}
                />
              </div>
            </InschrijvingCard>
          ))}
    </div>
  );
};

export default SelectDogsAndPeriods;
