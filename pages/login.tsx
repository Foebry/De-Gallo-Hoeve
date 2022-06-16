import React from "react";
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
import { useInitializeLocalStorage } from "../hooks/localStorage";

const Login: React.FC<{}> = () => {
  const router = useRouter();

  const { control, handleSubmit } = useForm();

  const onSubmit = async (values: any) => {
    const { data, error } = await useMutation(LOGINAPI, values);
    if (error) console.log(error);
    if (data) {
      useInitializeLocalStorage(data);
      router.push(INDEX);
    }
  };

  return (
    <section className="bg-grey-700 px-5 py-5">
      <Form title="Welkom bij de Gallo-hoeve" onSubmit={handleSubmit(onSubmit)}>
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
