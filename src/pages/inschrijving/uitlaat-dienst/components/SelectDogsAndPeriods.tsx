import { nanoid } from 'nanoid';
import React from 'react';
import { Control, UseFormGetValues, Controller } from 'react-hook-form';
import InschrijvingCard from '../../components/inschrijvingCard';
import { FormType } from '../index.page';
import Select, { MultiValue, OptionsOrGroups } from 'react-select';
import { useUserContext } from 'src/context/app/UserContext';
import { optionInterface } from 'src/components/register/HondGegevens';
import { Body } from 'src/components/Typography/Typography';
import { classNames } from 'src/shared/functions';
import { ActiveServiceEntry } from 'src/common/api/subscriptions';

type Props = {
  control: Control<FormType, any>;
  selectedWeekDays: string[];
  handleDeleteItem: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  getValues: UseFormGetValues<FormType>;
  handleHondSelect: (e: MultiValue<any>, weekday: string) => MultiValue<any>;
  handleMomentSelect: (e: MultiValue<any>, weekday: string) => MultiValue<any>;
  partiallyDisabledDays: ActiveServiceEntry[];
  ['r-if']: boolean;
};

const SelectDogsAndPeriods: React.FC<Props> = ({
  control,
  getValues,
  selectedWeekDays,
  handleDeleteItem,
  handleHondSelect,
  handleMomentSelect,
  partiallyDisabledDays,
  ['r-if']: rIf,
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

  const sortAscending = (a: string, b: string) => {
    if (recurring) return (a === '0' ? '7' : a) > (b === '0' ? '7' : b) ? 1 : -1;
    return new Date(a).getTime() - new Date(b).getTime();
  };

  const data = recurring ? selectedWeekDays : dates;

  const getOptionsForDate = (date: string) => {
    console.log({ date });
    const partiallyDisabledDates = partiallyDisabledDays.map((day) => day.date);
    console.log({
      partiallyDisabledDays,
      partiallyDisabledDates: partiallyDisabledDates ?? 'no partiallyDisabledDates',
    });

    if (partiallyDisabledDates.includes(date)) {
      const relevantDisabledDay = partiallyDisabledDays.find((day) => day.date === date);
      if (!relevantDisabledDay) return [];
      const relevantDisabledOptions = Object.keys(relevantDisabledDay.timeSlots).map((option) => option.toLowerCase());
      return momentOptions.filter((option) => !relevantDisabledOptions.includes(option.value.toLowerCase()));
    }
    return momentOptions;
  };

  return rIf ? (
    <>
      <div className="mb-16">
        <Body>
          Hou er rekening mee dat we voor deze dienst geen specifieke uren kunnen meegeven. <br />
          Indien u <span className="italic underline">Ochtend</span> aanduidde, kan u ons verwachten tussen{' '}
          <strong>06:00 - 11:00</strong>. <br />
          Duidde u <span className="italic underline">Middag</span> aan, dan kan u ons verwachten tussen{' '}
          <strong>11:00 - 16:00</strong>. <br />
          Wanneer u <span className="italic underline">Avond</span> aanduidde, kan u ons verwachten tussen{' '}
          <strong>16:00 - 21:00</strong>.
        </Body>
        <Body className="text-left">
          <strong>Let op</strong>: We rekenen voor ieder moment verplaatsingskosten aan. <br />
          Wilt u bijvoorbeeld dezelfde dag zowel &apos;s ochtends als &apos;s avonds van onze dienst gebruik maken, zijn
          we genoodzaakt hier 2x verplaatsingskosten aanrekenen.
        </Body>
      </div>
      {data.sort(sortAscending).map((weekday, index) => (
        <InschrijvingCard
          key={nanoid()}
          weekday={recurring ? weekdayMapper[weekday] : undefined}
          date={!recurring ? weekday : undefined}
          data-id={weekday}
          index={index}
          onDelete={handleDeleteItem}
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
                  options={getOptionsForDate(weekday)}
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
    </>
  ) : (
    <></>
  );
};

export default SelectDogsAndPeriods;
