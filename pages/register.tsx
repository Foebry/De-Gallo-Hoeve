import React, { useEffect, useState } from "react";
import Form from "../components/form/Form";
import { FormTabType } from "../components/form/FormTabs";
import axios from "axios";
import { useRouter } from "next/router";
import { LOGIN } from "../types/linkTypes";
import { useFieldArray, useForm } from "react-hook-form";
import Step1 from "../components/register/step1";
import Step2, { optionInterface } from "../components/register/step2";
import Step3 from "../components/register/step3";
import { OptionsOrGroups } from "react-select";
import getData from "../hooks/useApi";
import { RASSEN, REGISTERAPI } from "../types/apiTypes";
import useMutation, { structureHondenPayload } from "../hooks/useMutation";

interface RegisterProps {
  rassen: OptionsOrGroups<any, optionInterface>[];
}

const Register: React.FC<RegisterProps> = ({ rassen }) => {
  const router = useRouter();
  const register = useMutation();
  const { control, handleSubmit } = useForm();
  const { fields, append, remove } = useFieldArray({ control, name: "honden" });

  const [activeTab, setActiveTab] = useState<FormTabType>(1);

  const onSubmit = async (values: any) => {
    const payload = structureHondenPayload(values);
    console.log(payload);

    const { data, error } = await register(REGISTERAPI, payload);
    if (data) router.push(LOGIN);
    if (error) console.log(error);
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
  const { data: rassen } = await getData(RASSEN);

  return {
    props: {
      rassen,
    },
  };
};
