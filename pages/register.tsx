import React, { useState } from "react";
import Form from "../components/form/Form";
import { FormTabType } from "../components/form/FormTabs";
import axios from "axios";
import { useRouter } from "next/router";
import { LOGIN } from "../types/linkTypes";
import { useFieldArray, useForm } from "react-hook-form";
import Step1 from "./register/step1";
import Step2, { optionInterface } from "./register/step2";
import Step3 from "./register/step3";
import { OptionsOrGroups } from "react-select";

interface RegisterProps {
  rassen: OptionsOrGroups<any, optionInterface>[];
}

const Register: React.FC<RegisterProps> = ({ rassen }) => {
  const router = useRouter();
  const { control, handleSubmit } = useForm();
  const { fields, append, remove } = useFieldArray({ control, name: "honden" });

  const [activeTab, setActiveTab] = useState<FormTabType>(1);

  const onSubmit = async (values: any) => {
    try {
      await axios("http://localhost:8000/api/register", {
        method: "POST",
        data: { ...values, password: "password" },
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
      router.push(LOGIN);
    } catch (error) {}
  };

  return (
    <section className="bg-grey-700 px-5 py-5">
      <Form
        onSubmit={handleSubmit(onSubmit)}
        title={
          activeTab === 1
            ? "Persoonlijke gegevens"
            : activeTab === 2
            ? "Gegevens viervoeters"
            : activeTab === 3
            ? "Gegevens dierenarts"
            : "Verifieer uw gegevens aub"
        }
        formTabs={true}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      >
        {activeTab === 1 ? (
          <Step1 control={control} setActiveTab={setActiveTab} />
        ) : activeTab === 2 ? (
          <Step2
            control={control}
            setActiveTab={setActiveTab}
            fields={fields}
            append={append}
            remove={remove}
            options={rassen}
          />
        ) : activeTab === 3 ? (
          <Step3 control={control} setActiveTab={setActiveTab} />
        ) : null}
      </Form>
    </section>
  );
};

export default Register;

export const getStaticProps = async () => {
  let rassen = [];
  try {
    const { data } = await axios("http://localhost:8000/api/ras");
    rassen = data.map(({ id, naam }: { id: Number; naam: string }) => ({
      value: id,
      label: naam,
    }));
  } catch (error) {}

  return {
    props: {
      rassen,
    },
  };
};
