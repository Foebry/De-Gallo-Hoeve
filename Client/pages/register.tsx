import React, { useContext, useState } from "react";
import Form from "../components/form/Form";
import { useRouter } from "next/router";
import { LOGIN } from "../types/linkTypes";
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
import { AppContext } from "../context/appContext";

interface RegisterHondErrorInterface {
  naam?: string;
  geboortedatum?: string;
  ras_id?: string;
  geslacht?: string;
  chip_nr?: string;
}

interface RegisterErrorInterface {
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
}

const Register: React.FC<RegisterProps> = ({ rassen }) => {
  const router = useRouter();
  const register = useMutation();
  const { control, handleSubmit } = useForm();
  const { fields, append, remove } = useFieldArray({ control, name: "honden" });
  const [activeTab, setActiveTab] = useState<number>(1);
  const [formErrors, setFormErrors] = useState<RegisterErrorInterface>({});
  const { setModal } = useContext(AppContext);
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

  const handleErrors = (error: any) => {
    if (Object.keys(error).some((r) => step1.indexOf(r) >= 0)) setActiveTab(1);
    else if (Object.keys(error).some((r) => step2.indexOf(r) >= 0))
      setActiveTab(2);
    else if (Object.keys(error).includes("honden")) setActiveTab(3);
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
      payload,
      registerErrors,
      setFormErrors
    );
    if (data) {
      console.log(data);
      setModal?.({ type: "success", active: true, message: data.success });
      router.push(LOGIN);
    } else if (error) handleErrors(error);
  };

  return (
    <section className={SECTION_DARKER}>
      <Form
        onSubmit={handleSubmit(onSubmit)}
        title={
          activeTab === 1
            ? "Persoonlijke gegevens"
            : activeTab === 2
            ? "Gegevens viervoeters"
            : activeTab === 3
            ? "Kies een wachtwoord"
            : ""
        }
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabCount={3}
      >
        {activeTab === 1 ? (
          <Step1
            control={control}
            setActiveTab={setActiveTab}
            errors={formErrors}
            setErrors={setFormErrors}
          />
        ) : activeTab === 2 ? (
          <Step2
            control={control}
            setActiveTab={setActiveTab}
            fields={fields}
            append={append}
            remove={remove}
            options={rassen}
            errors={formErrors}
            setErrors={setFormErrors}
          />
        ) : activeTab === 3 ? (
          <Step3
            control={control}
            setActiveTab={setActiveTab}
            errors={formErrors}
            setErrors={setFormErrors}
          />
        ) : null}
      </Form>
    </section>
  );
};

export default Register;

export const getStaticProps = async () => {
  const { data } = await getData(RASSEN);
  const rassen = data.map((ras: { id: number; naam: string }) => ({
    value: ras.id,
    label: ras.naam,
  }));
  return {
    props: {
      rassen,
    },
    revalidate: 86400,
  };
};
