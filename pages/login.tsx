import React from "react";
import { FootNote, Link, Title2 } from "../components/Typography/Typography";
import { LoginInterface } from "../components/form/Form";
import Form from "../components/form/Form";
import FormInput from "../components/form/FormInput";
import useForm from "../hooks/useForm";
import { REGISTER } from "../types/linkTypes";

export type LoginRulesType = {
  email: {
    required: boolean;
    pattern: string;
  };
  password: {
    required: boolean;
    minLength: Number;
  };
};
export type LoginErrorsType = {
  email?: string;
  password?: string;
};

const Login = () => {
  const initialValues: LoginInterface = {
    email: "",
    password: "",
  };
  const loginRules: LoginRulesType = {
    email: {
      required: true,
      pattern: "",
    },
    password: {
      required: true,
      minLength: 8,
    },
  };

  const { onSubmit, onChange, values, formErrors } = useForm(
    initialValues,
    loginRules
  );

  const handleSubmit = () => {
    console.log("ok");
  };

  return (
    <Form
      title="Welkom bij de Gallo-hoeve"
      action="login"
      onSubmit={(e: any) => onSubmit(e, handleSubmit)}
    >
      <FormInput
        label="emailadress"
        name="email"
        id="email"
        type="text"
        value={values.email}
        onChange={onChange}
        error={formErrors.email ?? ""}
      />
      <FormInput
        label="password"
        name="password"
        id="password"
        type="password"
        value={values.password}
        onChange={onChange}
        error={formErrors.password ?? ""}
      />
      <FootNote>
        Nog geen account?{"	"}
        <span>
          <Link to={REGISTER}>registreer</Link>
        </span>
      </FootNote>
    </Form>
  );
};

export default Login;
