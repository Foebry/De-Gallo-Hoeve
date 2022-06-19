import React, { useState } from "react";
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
import useMutation, { structureHondenPayload } from "../hooks/useMutation";

interface RegisterProps {
  rassen: OptionsOrGroups<any, optionInterface>[];
}

const Register: React.FC<RegisterProps> = ({ rassen }) => {
  const router = useRouter();
  const register = useMutation();
  const { control, handleSubmit } = useForm();
  const { fields, append, remove } = useFieldArray({ control, name: "honden" });
  const [activeTab, setActiveTab] = useState<number>(1);

  const onSubmit = async (values: any) => {
    let payload = structureHondenPayload(values);

    const { data, error } = await register(REGISTERAPI, payload);
    if (error) console.log(error);
    else router.push(LOGIN);
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
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabCount={3}
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
  const { data } = await getData(RASSEN);
  const rassen = data.map((ras: { id: number; naam: string }) => ({
    value: ras.id,
    label: ras.naam,
  }));
  return {
    props: {
      rassen,
    },
  };
};
