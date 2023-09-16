import Head from 'next/head';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MultiValue } from 'react-select';
import Button, { SubmitButton } from 'src/components/buttons/Button';
import Form from 'src/components/form/Form';
import FormRow from 'src/components/form/FormRow';
import FormSteps from 'src/components/form/FormSteps';
import { SelectedRange } from 'src/components/form/inputs/date/DateRangeSelector';
import Skeleton from 'src/components/website/skeleton';
import { classNames } from 'src/shared/functions';
import ChooseOption from './components/ChooseOption';
import SelectDates from './components/SelectDates';
import SelectDogsAndPeriods from './components/SelectDogsAndPeriods';
import Overview from './components/Overview';

type DogsForDate = {
  date: string;
  weekday: string;
  dogs: { label: string; value: string }[];
};
type SelectedMoments = {
  date: string;
  weekday: string;
  moments: { label: string; value: string }[];
};

export type FormType = {
  recurring: boolean;
  period: SelectedRange;
  weekDays: string[];
  dates: string[];
  moments: SelectedMoments[];
  dogs: DogsForDate[];
};

export type HandleSelectWeekDayArgs = [
  e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  value: string[],
  onChange: (...event: any[]) => void
];

const Inschrijving = () => {
  const steps = [
    'Selecteer een optie',
    'Selecteer datum(s) / Selecteer periode',
    'Selecteer hond(en) & moment(en)',
    'overzicht',
  ];
  const formDefaultValues = useMemo(() => ({ dates: [], moments: [], dogs: [] }), []);
  const [activeStep, setActiveStep] = useState<number>(0);
  const { control, getValues, setValue } = useForm<FormType>({ defaultValues: formDefaultValues });
  const [selectedWeekDays, setSelectedWeekDays] = useState<string[]>(getValues().weekDays);

  const handleDeleteWeekDay = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const weekdayToDelete = e.currentTarget.parentElement?.dataset.id;
    const { weekDays } = getValues();
    const newValue = weekDays.filter((day) => day !== weekdayToDelete);
    setValue('weekDays', newValue);
    setSelectedWeekDays(newValue);
  };

  const handleSelectWeekdays = (...args: HandleSelectWeekDayArgs) => {
    const [e, value, onChange] = args;
    const selectedDay = e.currentTarget.dataset.id;
    if (!selectedDay) return;
    const dayInSelection = value.includes(selectedDay);
    const newValue = dayInSelection ? value.filter((day) => day !== selectedDay) : [...value, selectedDay];
    onChange(newValue);
    setSelectedWeekDays(newValue);
  };

  const handleHondSelect = (e: MultiValue<any>, weekday: string) => {
    const dogsValue = getValues().dogs;
    const currentDogsValue = dogsValue.find((v) => v.weekday === weekday);
    if (currentDogsValue) {
      const newDogsValue = dogsValue.map((value) =>
        value.weekday !== currentDogsValue.weekday ? value : { ...currentDogsValue, dogs: e }
      );
      return newDogsValue;
    }
    return [...dogsValue, { weekday, dogs: e }];
  };

  const handleMomentSelect = (e: MultiValue<any>, weekday: string) => {
    const momentsValue = getValues().moments;
    const currentDogsValue = momentsValue.find((v) => v.weekday === weekday);
    if (currentDogsValue) {
      const newMomentsValue = momentsValue.map((value) =>
        value.weekday !== currentDogsValue.weekday ? value : { ...currentDogsValue, moments: e }
      );
      return newMomentsValue;
    }
    return [...momentsValue, { weekday, moments: e }];
  };

  return (
    <>
      <Head>
        <title>De Gallo-hoeve - Inschrijving</title>
      </Head>
      <Skeleton>
        <div className="mx-auto max-w-7xl mt-20 md:px-5 pt-10 pb-80">
          <Form
            className="py-10 border-2 rounded-xl"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <FormRow
              className={`px-5 mb-8 ${classNames({
                'flex-row-reverse': activeStep === 0,
              })}`}
            >
              {activeStep !== 0 && <Button label="vorige" onClick={() => setActiveStep(activeStep - 1)} />}
              {activeStep !== steps.length && <Button label="volgende" onClick={() => setActiveStep(activeStep + 1)} />}
              {activeStep === steps.length && <SubmitButton label="verstuur" />}
            </FormRow>
            <FormSteps steps={steps} activeStep={activeStep} setActiveStep={setActiveStep} errorSteps={[]} />

            <div className="py-20 text-center px-10 lg:px-40 mx-auto">
              {activeStep === 0 ? (
                <ChooseOption control={control} getValues={getValues} setValue={setValue} />
              ) : activeStep === 1 ? (
                <SelectDates control={control} getValues={getValues} handleSelectWeekdays={handleSelectWeekdays} />
              ) : activeStep === 2 ? (
                <SelectDogsAndPeriods
                  control={control}
                  selectedWeekDays={selectedWeekDays}
                  handleDeleteWeekDays={handleDeleteWeekDay}
                  getValues={getValues}
                  handleHondSelect={handleHondSelect}
                  handleMomentSelect={handleMomentSelect}
                />
              ) : activeStep === 3 ? (
                <Overview getValues={getValues} />
              ) : (
                <></>
              )}
            </div>
          </Form>
        </div>
      </Skeleton>
    </>
  );
};

export default Inschrijving;
