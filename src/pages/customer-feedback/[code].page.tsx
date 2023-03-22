import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { SubmitButton } from 'src/components/buttons/Button';
import Form from 'src/components/form/Form';
import FormRow from 'src/components/form/FormRow';
import { FormTextBox } from 'src/components/form/FormTextBox';
import EmptyNav from 'src/components/nav/EmptyNav';
import { Title2, Title3 } from 'src/components/Typography/Typography';
import Rating from './components/Rating';
import { FeedbackBody as FormValues } from 'src/pages/api/feedback/schemas';
import { FeedbackContext } from 'src/context/FeedbackContext';
import Spinner from 'src/components/loaders/Spinner';

const Feedback: React.FC<{}> = () => {
  const router = useRouter();
  const uniqueCode = router.query.code as string;
  const { sendFeedback, isLoading, errors } = useContext(FeedbackContext);

  const { control, handleSubmit } = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    await sendFeedback(values, { code: uniqueCode });
  };

  enum Questions {
    Tevreden = 'Hoe tevreden bent u over de trainingen?',
    Communicatie = 'Hoe tevreden bent u over de communicatie?',
    Hulpzaam = 'Hoe hulpzaam zijn de trainingen voor jou?',
    Aanraden = 'Zou u ons aanraden aan vrienden / famillie?',
    Gebruik = 'Vindt u onze website makkelijk te gebruiken?',
  }

  return (
    <>
      <EmptyNav />
      <div className="max-w-5xl mx-auto mt-20 md:px-5">
        {isLoading && <Spinner />}
        {!isLoading && (
          <>
            <Title2 className="text-green-200">
              Bedankt dat u even de tijd wil nemen om ons te beoordelen!
            </Title2>
            <Title3>
              Hieronder volgen een 5-tal vragen ivm onze service en website.
              <br /> Gelieve aan te duiden wat voor u het best past bij de gestelde vraag.
            </Title3>
            <Form onSubmit={handleSubmit(onSubmit)} className="max-w-xl pb-20">
              <div className="max-w-4xl mx-auto mt-20 py-10">
                <Controller
                  name="happiness"
                  control={control}
                  render={({ field: { value, onChange, name } }) => (
                    <>
                      <Rating
                        name={name}
                        question={Questions.Tevreden}
                        min="Helemaal niet"
                        max="Zeer tevreden"
                        value={value}
                        onChange={onChange}
                        errors={errors}
                      />
                    </>
                  )}
                />
                <Controller
                  name="communication"
                  control={control}
                  render={({ field: { value, onChange, name } }) => (
                    <Rating
                      name={name}
                      question={Questions.Communicatie}
                      min="helemaal niet"
                      max="Zeer tevreden"
                      value={value}
                      onChange={onChange}
                      errors={errors}
                    />
                  )}
                />
                <Controller
                  name="helpful"
                  control={control}
                  render={({ field: { value, onChange, name } }) => (
                    <Rating
                      name={name}
                      question={Questions.Hulpzaam}
                      min="helemaal niet"
                      max="Zeer hulpzaam"
                      value={value}
                      onChange={onChange}
                      errors={errors}
                    />
                  )}
                />
                <Controller
                  name="usage"
                  control={control}
                  render={({ field: { value, onChange, name } }) => (
                    <Rating
                      name={name}
                      question={Questions.Gebruik}
                      min="Helemaal niet"
                      max="Zeer makkelijk"
                      value={value}
                      onChange={onChange}
                      errors={errors}
                    />
                  )}
                />
                <Controller
                  name="recommend"
                  control={control}
                  render={({ field: { value, onChange, name } }) => (
                    <Rating
                      name={name}
                      question={Questions.Aanraden}
                      min="Helemaal niet"
                      max="zeker weten"
                      value={value}
                      onChange={onChange}
                      errors={errors}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="missing"
                  render={({ field: { value, onChange } }) => (
                    <FormTextBox
                      style={{ marginBottom: '100px' }}
                      label="Hoe zouden we onze website nog kunnen verbeteren voor u?"
                      name="missing"
                      id="missing"
                      value={value ?? ''}
                      onChange={onChange}
                      errors={{}}
                      setErrors={() => {}}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="overall"
                  render={({ field: { value, onChange } }) => (
                    <FormTextBox
                      style={{ marginBottom: '100px' }}
                      label="Hoe zou u uw ervaring omschrijven? (1 - 2 zinnen)"
                      name="overall"
                      id="overall"
                      value={value ?? ''}
                      onChange={onChange}
                      errors={{}}
                      setErrors={() => {}}
                      required={true}
                    />
                  )}
                />
              </div>
              <FormRow className="flex-row-reverse">
                <SubmitButton label="Verstuur" />
              </FormRow>
            </Form>
          </>
        )}
      </div>
    </>
  );
};

export default Feedback;
