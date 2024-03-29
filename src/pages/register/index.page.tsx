import React, { Dispatch, useEffect, useState } from 'react';
import Form from 'src/components/form/Form';
import { useRouter } from 'next/router';
import { INDEX, LOGIN } from 'src/types/linkTypes';
import { useFieldArray, useForm } from 'react-hook-form';
import PersoonlijkeGegevens from 'src/components/register/PersoonlijkeGegevens';
import Step2, { optionInterface } from 'src/components/register/HondGegevens';
import { OptionsOrGroups } from 'react-select';
import { REGISTERAPI } from 'src/types/apiTypes';
import useMutation, { structureHondenPayload } from 'src/hooks/useMutation';
import FormSteps from 'src/components/form/FormSteps';
import { GetServerSidePropsContext } from 'next';
import nookies from 'nookies';
import { toast } from 'react-toastify';
import Button, { SubmitButton } from 'src/components/buttons/Button';
import { generateCsrf } from 'src/services/Validator';
import { useAppContext } from 'src/context/appContext';
import Skeleton from 'src/components/website/skeleton';
import Head from 'next/head';
import FormRow from 'src/components/form/FormRow';

export interface RegisterHondErrorInterface {
  naam?: string;
  geboortedatum?: string;
  ras_id?: string;
  geslacht?: string;
  chip_nr?: string;
}

export interface RegisterErrorInterface {
  vnaam?: string;
  lnaam?: string;
  email?: string;
  straat?: string;
  nr?: string;
  bus?: string;
  gemeente?: string;
  postcode?: string;
  telefoon?: string;
  honden?: RegisterHondErrorInterface[];
  password?: string;
  password_verification?: string;
}

interface RegisterProps {
  csrf: string;
}

const Register: React.FC<RegisterProps> = ({ csrf }) => {
  const { retrieveRassen } = useAppContext();
  const [formErrors, setFormErrors] = useState<RegisterErrorInterface>({});
  const router = useRouter();
  const register = useMutation<Partial<RegisterErrorInterface>>();
  const { control, handleSubmit, getValues } = useForm();
  const { fields, remove, append } = useFieldArray({
    control,
    name: 'honden',
  });
  const [disabled, setDisabled] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [errorSteps, setErrorSteps] = useState<number[]>([]);
  const [rassen, setRassen] = useState<OptionsOrGroups<any, optionInterface>[]>([]);
  const step1 = [
    'vnaam',
    'lnaam',
    'email',
    'straat',
    'nr',
    'bus',
    'gemeente',
    'postcode',
    'telefoon',
  ];
  const step2 = ['naam', 'ras_id', 'gelacht', 'chip_nr', 'geboortedatum', 'honden'];

  const setErrors = (step: number) => {
    setErrorSteps([...errorSteps, step]);
    if (activeStep > step) setActiveStep(step);
  };
  const handleErrors = (error: any) => {
    if (Object.keys(error).some((r) => step1.indexOf(r) >= 0)) setErrors(0);
    else if (Object.keys(error).some((r) => step2.indexOf(r) >= 1)) setErrors(1);
  };

  const validatePassword = (
    password: string,
    setFormErrors: Dispatch<React.SetStateAction<RegisterErrorInterface>>
  ) => {
    if (!password.match(/[a-z]+/))
      setFormErrors({
        ...formErrors,
        password: 'Minstens 1 kleine letter',
      });
    else if (!password.match(/[A-Z]+/))
      setFormErrors({
        ...formErrors,
        password: 'Minstens 1 hoofdletter',
      });
    else if (!password.match(/[&é@#§è!çà$£µ%ù?./<>°}{"'^*+-=~},;]+/))
      setFormErrors({
        ...formErrors,
        password: 'Minstens 1 speciaal teken',
      });
    else if (!password.match(/[0-9]+/))
      setFormErrors({ ...formErrors, password: 'Minstens 1 cijfer' });
    else if (password.length < 8)
      setFormErrors({ ...formErrors, password: 'Minstens 8 characters' });
  };

  const onSubmit = async (values: any) => {
    let payload = structureHondenPayload(values);
    if (values.password !== values.password_verification) {
      setFormErrors({
        ...formErrors,
        password_verification: 'Komt niet overeen.',
      });
      return toast.warning('Wachtwoorden komen niet overeen');
    }

    if (!disabled) {
      setDisabled(() => true);
      const { data, error } = await register(REGISTERAPI, { ...payload, csrf });
      if (data) {
        toast.success('Registratie succesvol!');
        router.push(LOGIN);
      }
      if (error) {
        handleErrors(error);
        toast.error(error.message);
        setFormErrors(error);
      }
      setDisabled(() => false);
    }
  };

  useEffect(() => {
    (async () => {
      const data = await retrieveRassen!();
      setRassen(data);
    })();
  }, []);

  return (
    <>
      <Head>
        <title>De Gallo-hoeve - registratie</title>
        <meta
          name="description"
          content="Honden trainer Hulshout en omstreken. Maak nu een account aan door enkele persoonlijke gegevens in te vullen, gegevens van uw hond(en). U ontvangt een email met registratie bevestiging, eenmaal bevestigt kan u nieuwe trainingen boeken."
          key="description registration"
        ></meta>
      </Head>
      <Skeleton>
        <section className="mb-48 md:px-5 mt-20">
          {activeStep === 1 && (
            <FormRow className="-mt-10 mb-10 px-10">
              <>
                <div>
                  <Button label="vorige" onClick={() => setActiveStep(activeStep - 1)} />
                </div>
                <div>
                  <SubmitButton label="verzend" onClick={() => onSubmit(getValues())} />
                </div>
              </>
            </FormRow>
          )}

          <div className="max-w-7xl mx-auto">
            <FormSteps
              activeStep={activeStep}
              errorSteps={errorSteps}
              setActiveStep={setActiveStep}
              steps={['Persoonlijke gegevens', 'Honden gegevens']}
            />
          </div>
          <div>
            <Form
              onSubmit={handleSubmit(onSubmit)}
              activeStep={activeStep}
              errorSteps={errorSteps}
              setActiveStep={setActiveStep}
            >
              <div className="max-w-4xl mx-auto mt-20 py-10">
                {activeStep === 0 ? (
                  <PersoonlijkeGegevens
                    control={control}
                    setActiveStep={setActiveStep}
                    errors={formErrors}
                    setErrors={setFormErrors}
                    validatePassword={validatePassword}
                  />
                ) : activeStep === 1 ? (
                  <Step2
                    control={control}
                    setActiveStep={setActiveStep}
                    fields={fields}
                    append={append}
                    remove={remove}
                    options={rassen}
                    errors={formErrors}
                    setErrors={setFormErrors}
                    values={getValues}
                  />
                ) : null}
              </div>
            </Form>
            {activeStep === 0 && (
              <FormRow className="px-10">
                <div></div>
                <Button label="volgende" onClick={() => setActiveStep(activeStep + 1)} />
              </FormRow>
            )}
          </div>
        </section>
      </Skeleton>
    </>
  );
};

export default Register;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const csrf = generateCsrf();

  return nookies.get(ctx).JWT
    ? { redirect: { permanent: false, destination: INDEX } }
    : { props: { csrf } };
};
