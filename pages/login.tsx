import React from "react";
import { Body, FootNote, Link } from "../components/Typography/Typography";
import Form from "../components/form/Form";
import FormInput from "../components/form/FormInput";
import useForm from "../hooks/useForm";
import { REGISTER, INDEX } from "../types/linkTypes";
import { FormValues } from "../types/formTypes/formTypes";
import { SubmitButton } from "../components/buttons/Button";
import FormRow from "../components/form/FormRow";
import axios from "axios";
import { useRouter } from "next/router";

const Login = () => {
  const router = useRouter();

  const { onChange, values, formErrors } = useForm(FormValues);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios("http://localhost:8000/api/login", {
        method: "POST",
        data: values,
      });
      // if (data.error) console.log(error);
      if (data) {
        localStorage.setItem("naam", data.naam);
        localStorage.setItem("id", data.id);
        router.push(INDEX);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="bg-grey-700 px-5 py-5">
      <Form title="Welkom bij de Gallo-hoeve" onSubmit={handleSubmit}>
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
          <SubmitButton label="login" />
        </FormRow>
      </Form>
    </section>
  );
};

export default Login;
