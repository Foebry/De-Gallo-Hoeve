import React from 'react';
import { Body } from 'src/components/Typography/Typography';
import Form from 'src/components/form/Form';
import FormInput from 'src/components/form/FormInput';
import { REGISTER, INDEX } from 'src/types/linkTypes';
import { SubmitButton } from 'src/components/buttons/Button';
import FormRow from 'src/components/form/FormRow';
import { useForm, Controller } from 'react-hook-form';
import { GetServerSidePropsContext } from 'next';
import nookies from 'nookies';
import validator, { generateCsrf } from 'src/services/Validator';
import Skeleton from 'src/components/website/skeleton';
import Link from 'next/link';
import Head from 'next/head';
import { useAxiosContext } from 'src/context/AxiosContext';
import Spinner from 'src/components/loaders/Spinner';
import { useApiContext } from 'src/context/api/ApiContext';

export interface LoginErrorInterface {
  email: string;
  password: string;
}

interface LoginPropsInterface {
  redirect: string;
  csrf: string;
}

const Login: React.FC<LoginPropsInterface> = ({ csrf }) => {
  // const { login, errors } = useAuthContext();
  const { login, errors } = useApiContext();
  const { isLoading } = useAxiosContext();
  const { control, handleSubmit } = useForm();

  const onSubmit = async (values: any) => login({ ...values, csrf });

  return (
    <>
      <Head>
        <title>De Gallo-hoeve - login</title>
        <meta
          name="description"
          content="Honden trainer Hulshout en omstreken. Login om toegang te krijgen tot uw accout."
          key="description login"
        ></meta>
      </Head>
      <Skeleton>
        <section>
          <div className="max-w-lg mx-auto mt-30 mb-48 border-2 rounded">
            {isLoading && <Spinner />}
            {!isLoading && (
              <Form onSubmit={handleSubmit(onSubmit)} className="mb-5">
                <div className="p-10">
                  <div className="text-center mb-10">
                    <Body>Login met email en wachtwoord</Body>
                  </div>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <FormInput
                        label="email"
                        name="email"
                        id="email"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        errors={errors}
                      />
                    )}
                  />
                  <Controller
                    name="password"
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <FormInput
                        label="password"
                        name="password"
                        id="password"
                        type="password"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        errors={errors}
                      />
                    )}
                  />
                  <FormRow>
                    <Body>
                      Nog geen account?{'	'}
                      <span className="text-green-200 underline">
                        <Link href={REGISTER}>registreer</Link>
                      </span>
                    </Body>
                    <SubmitButton label="login" onClick={handleSubmit(onSubmit)} />
                  </FormRow>
                  <div className="text-center mt-20">
                    {/* <Body>Login met andere app</Body> */}
                  </div>
                </div>
              </Form>
            )}
            <FormRow className="py-5">
              {/* <Button label="Login with Facebook" className="mx-auto" /> */}
            </FormRow>
          </div>
        </section>
      </Skeleton>
    </>
  );
};

export default Login;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const redirect = validator.redirect ?? null;
  const csrf = generateCsrf();

  const cookies = nookies.get(ctx);

  return cookies.JWT
    ? { redirect: { permanent: false, destination: INDEX } }
    : { props: { redirect, csrf } };
};
