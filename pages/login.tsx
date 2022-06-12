import React from "react";
import { Body, FootNote, Link } from "../components/Typography/Typography";
import Form from "../components/form/Form";
import FormInput from "../components/form/FormInput";
import useForm from "../hooks/useForm";
import { REGISTER } from "../types/linkTypes";
import { FormValues } from "../types/formTypes/formTypes";
import Button from "../components/buttons/Button";
import FormRow from "../components/form/FormRow";

const Login = () => {
  const { onSubmit, onChange, values, formErrors } = useForm(FormValues);

  const handleSubmit = () => {
    console.log("ok");
  };

  return (
    <Form
      title="Welkom bij de Gallo-hoeve"
      onSubmit={(e: any) => onSubmit(e, handleSubmit)}
    >
      <FormInput
        label="emailadress"
        name="email"
        id="email"
        type="text"
        value={values.email ?? ""}
        onChange={onChange}
        error={formErrors.email ?? ""}
      />
      <FormInput
        label="password"
        name="password"
        id="password"
        type="password"
        value={values.password ?? ""}
        onChange={onChange}
        error={formErrors.password ?? ""}
      />
      <FormRow>
        <Body>
          Nog geen account?{"	"}
          <span>
            <Link to={REGISTER}>registreer</Link>
          </span>
        </Body>
        <Button label="login" />
      </FormRow>
    </Form>
  );
};

export default Login;
