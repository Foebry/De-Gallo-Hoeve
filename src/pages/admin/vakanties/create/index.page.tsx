import { useState } from 'react';
import Dashboard from 'src/components/admin/dashboard';
import Button, { SubmitButton } from 'src/components/buttons/Button';
import FormRow from 'src/components/form/FormRow';
import FormSteps from 'src/components/form/FormSteps';
import VacationDuration from './components/duration';
import ExtraVacationInfo from './components/extraInfo';
import ExampleNotification from './components/exampleNotification';
import Form from 'src/components/form/Form';
import { FieldValues, useForm } from 'react-hook-form';
import { VacationDto } from '@/types/DtoTypes/VacationDto';

type Props = {};
export type FormType = VacationDto & { duration: { from: string; to: string } };

const Create: React.FC<Props> = ({}) => {
  const steps = ['details', 'periode'];
  const [activeStep, setActiveStep] = useState<number>(0);
  const [errorSteps, setErrorSteps] = useState<number[]>([]);

  const { handleSubmit, control, register } = useForm<FormType>();

  const onSubmit = async (values: FieldValues) => {
    console.log({ values });
  };

  return (
    <Dashboard>
      <FormSteps
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        steps={steps}
        errorSteps={errorSteps}
      />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormRow className="flex-row-reverse">
          {activeStep + 1 === steps.length ? (
            <SubmitButton label="verzend" onClick={() => handleSubmit(onSubmit)} />
          ) : (
            <Button label="volgende" onClick={() => setActiveStep(activeStep + 1)} />
          )}
        </FormRow>
        <div className="mt-20">
          {activeStep === 1 ? (
            <VacationDuration control={control} />
          ) : activeStep === 0 ? (
            <ExtraVacationInfo control={control} />
          ) : (
            <></>
          )}
        </div>
      </Form>
    </Dashboard>
  );
};

export default Create;
