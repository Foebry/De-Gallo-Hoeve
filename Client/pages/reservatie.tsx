import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import Form from "../components/form/Form";
import Step1 from "../components/reservatie/Step1";
import Step2 from "../components/reservatie/Step2";
import useMutation, { structureDetailsPayload } from "../hooks/useMutation";
import { RESERVATIEAPI } from "../types/apiTypes";
import { LOGIN } from "../types/linkTypes";

interface ReservatieProps {
  honden: any;
  hondenOptions: any;
}

const Reservatie: React.FC<ReservatieProps> = ({ honden, hondenOptions }) => {
  const router = useRouter();
  const makeReservation = useMutation();
  const { control, handleSubmit, getValues } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "details",
  });
  const [activeTab, setActiveTab] = useState<number>(1);
  const [user, setUser] = useState<string | null>();

  const onSubmit = async (values: any) => {
    values.klant_id = localStorage.getItem("id");
    values = structureDetailsPayload(values);
    console.log(values);
    const { data, error } = await makeReservation(RESERVATIEAPI, values);
    if (error) console.log(error);
    else router.push(LOGIN);
  };

  useEffect(() => {
    const id = localStorage.getItem("id");
    setUser(id);
  }, []);

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
        tabCount={user ? 2 : null}
      >
        {activeTab === 1 ? (
          <Step1
            control={control}
            setActiveTab={setActiveTab}
            fields={fields}
            append={append}
            remove={remove}
            honden={honden}
            options={hondenOptions}
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

export const getServerSideProps = async () => {
  return {
    props: {
      honden: [
        {
          naam: "Jacko",
          id: 1,
        },
        {
          naam: "Jumbo",
          id: 2,
        },
      ],
      hondenOptions: [
        {
          value: 1,
          label: "Jacko",
        },
        {
          value: 2,
          label: "Jumbo",
        },
      ],
    },
  };
};
