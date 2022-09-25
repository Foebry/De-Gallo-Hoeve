import React, { Dispatch, useEffect, useState } from "react";
import Form from "../components/form/Form";
import { useRouter } from "next/router";
import { INDEX, LOGIN } from "../types/linkTypes";
import { useFieldArray, useForm } from "react-hook-form";
import PersoonlijkeGegevens from "../components/register/PersoonlijkeGegevens";
import Step2, { optionInterface } from "../components/register/HondGegevens";
import { OptionsOrGroups } from "react-select";
import { REGISTERAPI } from "../types/apiTypes";
import useMutation, { structureHondenPayload } from "../hooks/useMutation";
import FormSteps from "../components/form/FormSteps";
import { GetServerSidePropsContext } from "next";
import nookies from "nookies";
import { toast } from "react-toastify";
import FormRow from "../components/form/FormRow";
import Button, { SubmitButton } from "../components/buttons/Button";
import { generateCsrf } from "../middleware/Validator";
import { useAppContext } from "../context/appContext";

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
  const register = useMutation(formErrors, setFormErrors);
  const { control, handleSubmit, getValues } = useForm();
  const { fields, remove, append } = useFieldArray({
    control,
    name: "honden",
  });
  const [disabled, setDisabled] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [errorSteps, setErrorSteps] = useState<number[]>([]);
  const [rassen, setRassen] = useState<OptionsOrGroups<any, optionInterface>[]>(
    []
  );
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

  const validatePassword = (
    password: string,
    setFormErrors: Dispatch<React.SetStateAction<RegisterErrorInterface>>
  ) => {
    if (!password.match(/[a-z]+/))
      setFormErrors({
        ...formErrors,
        password: "Minstens 1 kleine letter",
      });
    else if (!password.match(/[A-Z]+/))
      setFormErrors({
        ...formErrors,
        password: "Minstens 1 hoofdletter",
      });
    else if (!password.match(/[&é@#§è!çà$£µ%ù?./<>°}{"'^*+-=~},;]+/))
      setFormErrors({
        ...formErrors,
        password: "Minstens 1 speciaal teken",
      });
    else if (!password.match(/[0-9]+/))
      setFormErrors({ ...formErrors, password: "Minstens 1 cijfer" });
    else if (password.length < 8)
      setFormErrors({ ...formErrors, password: "Minstens 8 characters" });
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

    if (!disabled) {
      setDisabled(() => true);
      const { data, error } = await register(REGISTERAPI, { ...payload, csrf });
      if (data) {
        toast.success(data.message);
        router.push(LOGIN);
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
    <section className="mb-48 md:px-5 mt-20">
      <div className="max-w-7xl mx-auto">
        <FormSteps
          activeStep={activeStep}
          errorSteps={[]}
          setActiveStep={setActiveStep}
          steps={["Persoonlijke gegevens", "Honden gegevens"]}
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
        {activeStep > 0 && (
          <div className="absolute left-10 top-20">
            <Button
              label="vorige"
              onClick={() => setActiveStep(activeStep - 1)}
            />
          </div>
        )}
        <div className="absolute right-10 top-20">
          {activeStep === 1 ? (
            <SubmitButton
              label="verzend"
              onClick={() => onSubmit(getValues())}
            />
          ) : (
            <Button
              label="volgende"
              onClick={() => setActiveStep(activeStep + 1)}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Register;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const csrf = generateCsrf();

  return nookies.get(ctx).JWT
    ? { redirect: { permanent: false, destination: INDEX } }
    : { props: { csrf } };
};
