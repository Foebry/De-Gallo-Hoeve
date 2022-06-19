import { useRouter } from "next/router";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import Form from "../components/form/Form";
import Step1 from "../components/reservatie/Step1";
import Step2 from "../components/reservatie/Step2";
import getData from "../hooks/useApi";
import useMutation, { structureDetailsPayload } from "../hooks/useMutation";
import { KLANT_HONDEN, RESERVATIEAPI } from "../types/apiTypes";
import { LOGIN } from "../types/linkTypes";

interface ReservatieProps {}

const Reservatie: React.FC<ReservatieProps> = () => {
  const router = useRouter();
  const makeReservation = useMutation();
  const { control, handleSubmit, getValues } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "details",
  });
  const [activeTab, setActiveTab] = useState<number>(1);
  const [klantId, setKlantId] = useState<string | null>();
  useEffect(() => {
    const id = localStorage.getItem("id");
    setKlantId(id);
  }, []);

  const onSubmit = async (values: any) => {
    values = structureDetailsPayload(values);
    values.klant_id = klantId;
    const { data, error } = await makeReservation(RESERVATIEAPI, values);
    if (error) console.log(error);
    else router.push(LOGIN);
  };

  return (
    <section className="bg-grey-700 px-5 py-5">
      <Form
        className="md:w-10/12"
        onSubmit={handleSubmit(onSubmit)}
        title={
          activeTab === 1
            ? "Wie komt logeren?"
            : activeTab === 2
            ? "Wanneer komen zij logeren?"
            : ""
        }
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabCount={klantId ? 2 : null}
      >
        {activeTab === 1 ? (
          <Step1
            control={control}
            setActiveTab={setActiveTab}
            fields={fields}
            append={append}
            remove={remove}
            values={getValues}
          />
        ) : activeTab === 2 ? (
          <Step2 control={control} setActiveTab={setActiveTab} />
        ) : null}
      </Form>
    </section>
  );
};

export default Reservatie;

export const getServerSideProps = async (ctx: any) => {
  const klantId = ctx.query?.klant ?? 0;
  const { data: honden } = await getData(KLANT_HONDEN, { klantId });
  console.log("honden", honden);
  const hondenOptions = honden.map((hond: any) => ({
    value: hond.id,
    label: hond.naam,
  }));
  console.log("options", hondenOptions);
  return {
    props: {
      honden,
      hondenOptions,
    },
  };
};
