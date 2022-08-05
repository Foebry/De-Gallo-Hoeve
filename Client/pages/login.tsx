import React, { useState } from "react";
import { Body, Link } from "../components/Typography/Typography";
import Form from "../components/form/Form";
import FormInput from "../components/form/FormInput";
import { REGISTER, INDEX } from "../types/linkTypes";
import { SubmitButton } from "../components/buttons/Button";
import FormRow from "../components/form/FormRow";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import useMutation from "../hooks/useMutation";
import { LOGINAPI } from "../types/apiTypes";
import { initializeLocalStorage } from "../helpers/localStorage";
import { GetServerSidePropsContext } from "next";
import { validator } from "../middleware/Validator";

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
      router.push(redirect);
    }
  };

  return (
    <section className="bg-grey-700 px-5 py-5">
      <Form onSubmit={handleSubmit(onSubmit)} className="mt-20">
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
          <SubmitButton label="login" />
        </FormRow>
      </Form>
    </section>
  );
};

export default Login;

export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
  const redirect = validator.redirect ?? INDEX;
  validator.redirect = undefined;
  return { props: { redirect } };
};
