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
import { validator } from "../middleware/Validator";
import nookies from "nookies";

interface LoginErrorInterface {
  email?: string;
  password?: string;
}

const Login: React.FC<{ redirect: string }> = ({ redirect }) => {
  const router = useRouter();
  const login = useMutation();

  const [formErrors, setFormErrors] = useState<LoginErrorInterface>({});
  const { control, handleSubmit } = useForm();

  const onSubmit = async (values: any) => {
    const { data } = await login(LOGINAPI, values, formErrors, setFormErrors);
    if (data) {
      initializeLocalStorage(data);
      redirect ? router.push(redirect) : router.back();
    }
  };

  return (
    <section>
      <div className="max-w-xl mx-auto mt-30 mb-48 border-2 rounded">
        <Form onSubmit={handleSubmit(onSubmit)} className="mb-5">
          <div className="text-center">
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
            <SubmitButton label="login" onClick={handleSubmit(onSubmit)} />
          </FormRow>
          <div className="text-center mt-20">
            <Body>Login met andere app</Body>
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

export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
  const redirect = validator.redirect ?? null;
  validator.redirect = undefined;

  return nookies.get(ctx).JWT
    ? { redirect: { permanent: false, destination: INDEX } }
    : { props: { redirect } };
};
