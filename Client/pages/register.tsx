import React, { useState } from "react";
import Form from "../components/form/Form";
import { useRouter } from "next/router";
import { INDEX, LOGIN } from "../types/linkTypes";
import { useFieldArray, useForm } from "react-hook-form";
import Step1 from "../components/register/step1";
import Step2, { optionInterface } from "../components/register/step2";
import Step3 from "../components/register/step3";
import { OptionsOrGroups } from "react-select";
import getData from "../hooks/useApi";
import { RASSEN, REGISTERAPI } from "../types/apiTypes";
import useMutation, {
  handleErrors,
  structureHondenPayload,
} from "../hooks/useMutation";
import { SECTION_DARKER } from "../types/styleTypes";
import FormSteps from "../components/form/FormSteps";
import { GetServerSidePropsContext } from "next";
import nookies from "nookies";
import db, { conn } from "../middleware/db";
import { refreshCsrf } from "../middleware/Validator";
import { toast } from "react-toastify";

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

const registerErrors: RegisterErrorInterface = {};

interface RegisterProps {
  rassen: OptionsOrGroups<any, optionInterface>[];
  csrf: string;
}

const Register: React.FC<RegisterProps> = ({ rassen, csrf }) => {
  console.log({ csrf });
  const router = useRouter();
  const register = useMutation();
  const { control, handleSubmit } = useForm();
  const { fields, append, remove } = useFieldArray({ control, name: "honden" });
  const [activeStep, setActiveStep] = useState<number>(0);
  const [errorSteps, setErrorSteps] = useState<number[]>([]);
  const [formErrors, setFormErrors] = useState<RegisterErrorInterface>({});
  const step1 = [
    "vnaam",
    "lnaam",
    "email",
    "straat",
    "nr",
    "bus",
    "gemeente",
    "postcode",
    "telefoon",
  ];
  const step2 = ["naam", "ras_id", "gelacht", "chip_nr", "geboortedatum"];

  const setErrors = (step: number) => {
    setErrorSteps((prev) => [...prev, step]);
    setActiveStep(Math.min(...errorSteps));
  };
  const handleErrors = (error: any) => {
    if (Object.keys(error).some((r) => step1.indexOf(r) >= 0)) setErrors(0);
    else if (Object.keys(error).some((r) => step2.indexOf(r) >= 1))
      setErrors(1);
    else if (Object.keys(error).includes("honden")) setErrors(2);
  };

  const onSubmit = async (values: any) => {
    let payload = structureHondenPayload(values);
    if (values.password !== values.password_verification) {
      setFormErrors({
        ...formErrors,
        password_verification: "Komt niet overeen.",
      });
      return;
    }

    const { data, error } = await register(
      REGISTERAPI,
      { ...payload, csrf },
      registerErrors,
      setFormErrors
    );
    if (data) {
      toast.success(data.message);
      router.push(LOGIN);
    }
  };

  return (
    <section className="mb-48">
      <div className="max-w-7xl mx-auto">
        <FormSteps
          activeStep={activeStep}
          errorSteps={[]}
          setActiveStep={setActiveStep}
          steps={[
            "Persoonlijke gegevens",
            "Honden aanmaken",
            "Wachtwoord aanmaken",
          ]}
        />
      </div>
      <div className="max-w-4xl mx-auto border-2 rounded mt-20 py-10">
        <Form
          onSubmit={handleSubmit(onSubmit)}
          activeStep={activeStep}
          errorSteps={errorSteps}
          setActiveStep={setActiveStep}
        >
          {activeStep === 0 ? (
            <Step1
              control={control}
              setActiveStep={setActiveStep}
              errors={formErrors}
              setErrors={setFormErrors}
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
            />
          ) : activeStep === 2 ? (
            <Step3
              control={control}
              setActiveStep={setActiveStep}
              errors={formErrors}
              setErrors={setFormErrors}
            />
          ) : null}
        </Form>
      </div>
    </section>
  );
};

export default Register;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const csrf = refreshCsrf();
  const rassen = await db.query({
    builder: conn.select("id as value", "naam as label").from("ras"),
  });

  return nookies.get(ctx).JWT
    ? { redirect: { permanent: false, destination: INDEX } }
    : { props: { rassen, csrf } };
};
