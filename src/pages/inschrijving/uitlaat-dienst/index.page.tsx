import Head from 'next/head';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button, { SubmitButton } from 'src/components/buttons/Button';
import Form from 'src/components/form/Form';
import FormRow from 'src/components/form/FormRow';
import FormSteps from 'src/components/form/FormSteps';
import Skeleton from 'src/components/website/skeleton';
import ChooseOption from './components/ChooseOption';
import SelectDates from './components/Step1';
import SelectDogs from './components/Step2';
import Overview from './components/Step3';

type DogsForDate = {
  date: string;
  dogs: { label: string; key: string }[];
};
type SelectedMoments = {
  date: string;
  moments: string[];
};

export type FormType = {
  dates: string[];
  moments: SelectedMoments[];
  dogs: DogsForDate[];
};

const Inschrijving = () => {
  const steps = ['Selecteer een optie', 'Selecteer datum(s)', 'Selecteer hond(en) & moment(en)', 'overzicht'];
  const [activeStep, setActiveStep] = useState<number>(0);
  const { control, getValues } = useForm<FormType>({
    defaultValues: {
      dates: [],
      moments: [],
      dogs: [],
    },
  });
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
            <FormSteps steps={steps} activeStep={activeStep} setActiveStep={setActiveStep} errorSteps={[]} />

            <div className="py-20 text-center px-40 mx-auto">
              {activeStep === 0 ? (
                <ChooseOption control={control} />
              ) : activeStep === 1 ? (
                <SelectDates control={control} />
              ) : activeStep === 2 ? (
                <SelectDogs control={control} getValues={getValues} />
              ) : activeStep === 3 ? (
                <Overview />
              ) : (
                <></>
              )}
            </div>
            <FormRow className={`px-5 ${activeStep === 0 ? 'flex-row-reverse' : undefined}`}>
              {activeStep !== 0 && <Button label="vorige" onClick={() => setActiveStep(activeStep - 1)} />}
              {activeStep !== steps.length && <Button label="volgende" onClick={() => setActiveStep(activeStep + 1)} />}
              {activeStep === steps.length && <SubmitButton label="verstuur" />}
            </FormRow>
          </Form>
        </div>
      </Skeleton>
    </>
  );
};

export default Inschrijving;
