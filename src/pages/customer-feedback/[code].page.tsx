import { FEEDBACK_API } from '@/types/apiTypes';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Form from 'src/components/form/Form';
import FormSteps from 'src/components/form/FormSteps';
import EmptyNav from 'src/components/nav/EmptyNav';
import useMutation from 'src/hooks/useMutation';
import FeedbackRedirect from './components/feedback-redirect';
import FeedbackService from './components/feedback-service';
import FeedbackWebsite from './components/feedback-website';

type FormValues = {};

const Feedback: React.FC<{}> = () => {
  const router = useRouter();
  const [disabled, setDisabled] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [errors, setErrors] = useState<FormValues>();
  const uniqueCode = router.query.code;
  const sendFeedback = useMutation(errors, setErrors);

  const { control, handleSubmit } = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    if (!disabled) setDisabled(true);
    const url = `${FEEDBACK_API}${uniqueCode}`;
    const { data, error } = await sendFeedback(url, { ...values });
    if (data) toast.success('Formulier goed ontvangen!');
    if (error) toast.error('Er is iets misgegaan, probeer later opnieuw');
    setDisabled(false);
  };

  return (
    <>
      <EmptyNav />
      <div className="max-w-7xl mx-auto mt-20 md:px-5">
        <FormSteps
          activeStep={activeStep}
          errorSteps={[]}
          setActiveStep={setActiveStep}
          steps={['service', 'website']}
        />
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="max-w-4xl mx-auto mt-20 py-10">
            {activeStep === 0 && (
              <FeedbackService control={control} setActiveStep={setActiveStep} />
            )}
            {activeStep === 1 && (
              <FeedbackWebsite control={control} setActiveStep={setActiveStep} />
            )}
            {activeStep === 2 && <FeedbackRedirect />}
          </div>
        </Form>
      </div>
    </>
  );
};

export default Feedback;
