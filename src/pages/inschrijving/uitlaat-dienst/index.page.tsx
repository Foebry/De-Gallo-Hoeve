import Head from 'next/head';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MultiValue } from 'react-select';
import Button from 'src/components/buttons/Button';
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
import { useUserContext } from 'src/context/app/UserContext';
import Spinner from 'src/components/loaders/Spinner';
import { useSubscriptionContext } from 'src/context/app/SubscriptionContext';
import { SubscriptionDto } from 'src/common/api/dtos/Subscription';
import { useCreateSubscription } from 'src/common/api/inschrijving';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

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
  const router = useRouter();
  const { klant } = useUserContext();
  const formDefaultValues = useMemo(() => ({ dates: [], moments: [], dogs: [] }), []);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { control, getValues, setValue } = useForm<FormType>({ defaultValues: formDefaultValues });
  const [selectedWeekDays, setSelectedWeekDays] = useState<string[]>(getValues().weekDays);
  const { checkAvailableSubscriptions, mapToSubscriptionDto } = useSubscriptionContext();
  const {
    mutate: saveSubscriptionMutate,
    error: mutationError,
    isLoading: mutationLoading,
    data: mutationData,
  } = useCreateSubscription();

  const handleDeleteWeekDay = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const weekdayToDelete = event.currentTarget.parentElement?.dataset.id;
    const { weekDays, dogs, moments } = getValues();
    const newValue = weekDays.filter((day) => day !== weekdayToDelete);
    const newDogsValue = dogs.filter((dogForDate) => dogForDate.weekday !== weekdayToDelete);
    const newMomentsValue = moments.filter((momentForDate) => momentForDate.weekday !== weekdayToDelete);
    setValue('weekDays', newValue);
    setValue('dogs', newDogsValue);
    setValue('moments', newMomentsValue);
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

  const onSubmit = async (values: SubscriptionDto | undefined) => {
    if (!values) return;
    await saveSubscriptionMutate(values);
  };

  useEffect(() => {
    if (!mutationError) return;
    toast.error(mutationError.message);
  }, [mutationError]);

  useEffect(() => {
    if (mutationData) {
      toast.success('Uw inschrijving is verwerkt!');
      router.push('/');
    }
  }, [mutationData]);

  const handleStepChange = async (step: number) => {
    if (activeStep === 2) {
      if (!klant) return;
      setIsLoading(true);
      const values = getValues();
      const payload = mapToSubscriptionDto(values, klant);
      await checkAvailableSubscriptions(payload);
      setIsLoading(false);
    }
    setActiveStep(step);
  };

  return (
    <>
      <Head>
        <title>De Gallo-hoeve - Inschrijving</title>
      </Head>
      <Skeleton>
        <div className="mx-auto max-w-7xl mt-20 md:px-5 pt-10 pb-80">
          <Form className="py-10 border-2 rounded-xl">
            <FormRow
              className={`px-5 mb-8 ${classNames({
                'flex-row-reverse': activeStep === 0,
              })}`}
            >
              {activeStep !== 0 && <Button label="vorige" onClick={() => handleStepChange(activeStep - 1)} />}
              {activeStep !== steps.length - 1 && (
                <Button label="volgende" onClick={() => handleStepChange(activeStep + 1)} />
              )}
            </FormRow>
            <FormSteps steps={steps} activeStep={activeStep} setActiveStep={setActiveStep} errorSteps={[]} />

            {<Spinner r-if={isLoading || mutationLoading} />}
            {!isLoading && !mutationLoading && (
              <div className="py-20 text-center px-10 mx-auto">
                <ChooseOption control={control} getValues={getValues} setValue={setValue} r-if={activeStep === 0} />
                <SelectDates
                  r-if={activeStep === 1}
                  control={control}
                  getValues={getValues}
                  handleSelectWeekdays={handleSelectWeekdays}
                />
                <SelectDogsAndPeriods
                  control={control}
                  selectedWeekDays={selectedWeekDays}
                  handleDeleteWeekDays={handleDeleteWeekDay}
                  getValues={getValues}
                  handleHondSelect={handleHondSelect}
                  handleMomentSelect={handleMomentSelect}
                  r-if={activeStep === 2}
                />
                <Overview onSubmit={onSubmit} r-if={activeStep === 3} />
              </div>
            )}
          </Form>
        </div>
      </Skeleton>
    </>
  );
};

export default Inschrijving;
