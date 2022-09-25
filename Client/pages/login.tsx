import React, { useState } from "react";
import { Body, Link } from "../components/Typography/Typography";
import Form from "../components/form/Form";
import FormInput from "../components/form/FormInput";
import { REGISTER, INDEX } from "../types/linkTypes";
import Button, { SubmitButton } from "../components/buttons/Button";
import FormRow from "../components/form/FormRow";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import useMutation from "../hooks/useMutation";
import { LOGINAPI } from "../types/apiTypes";
import { initializeLocalStorage } from "../helpers/localStorage";
import { GetServerSidePropsContext } from "next";
import nookies from "nookies";
import validator, { generateCsrf } from "../middleware/Validator";

export interface LoginErrorInterface {
  email: string;
  password: string;
}

interface LoginPropsInterface {
  redirect: string;
  csrf: string;
}

const Login: React.FC<LoginPropsInterface> = ({ redirect, csrf }) => {
  const [disabled, setDisabled] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<LoginErrorInterface>({
    email: "",
    password: "",
  });

  const router = useRouter();
  const login = useMutation(formErrors, setFormErrors);
  const { control, handleSubmit } = useForm();

  const onSubmit = async (values: any) => {
    let data;
    if (!disabled) {
      setDisabled(() => true);
      const { data: response } = await login(LOGINAPI, { ...values, csrf });
      data = response;
    }

    if (data) {
      redirect ? router.push(redirect) : router.back();
    }
    setDisabled(() => false);
  };

  return (
    <section>
      <div className="max-w-lg mx-auto mt-30 mb-48 border-2 rounded">
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
                  errors={formErrors}
                  setErrors={setFormErrors}
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
                  errors={formErrors}
                  setErrors={setFormErrors}
                />
              )}
            />
            <FormRow>
              <Body>
                Nog geen account?{"	"}
                <span>
                  <Link to={REGISTER}>registreer</Link>
                </span>
              </Body>
              <SubmitButton
                label="login"
                onClick={handleSubmit(onSubmit)}
                disabled={disabled}
              />
            </FormRow>
            <div className="text-center mt-20">
              <Body>Login met andere app</Body>
            </div>
          </div>
        </Form>
        <FormRow className="py-5">
          <Button label="Login with Facebook" className="mx-auto" />
        </FormRow>
      </div>
    </section>
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
