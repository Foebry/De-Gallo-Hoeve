import { useRouter } from "next/router";
import React, { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import Form from "../../components/form/Form";
import Step1 from "../../components/inschrijving/Step1";
import Step2 from "../../components/inschrijving/Step2";
import getData from "../../hooks/useApi";
import useMutation from "../../hooks/useMutation";
import {
  GET_FUTURE_INSCHRIJVINGS,
  KLANT_HONDEN,
  POST_INSCHRIJVING,
} from "../../types/apiTypes";
import { RegisterHondInterface } from "../../types/formTypes/registerTypes";
import { INDEX } from "../../types/linkTypes";
import { SECTION_DARKER } from "../../types/styleTypes";

interface PriveLessenProps {
  honden: RegisterHondInterface[];
  disabledDays: string[];
}

interface InschrijvingErrorInterface {
  hond_id?: number;
  training_id?: number;
  klant_id?: number;
  datum?: string;
}

const Privelessen: React.FC<PriveLessenProps> = ({ honden, disabledDays }) => {
  const router = useRouter();

  const { handleSubmit, control } = useForm();
  const inschrijving = useMutation();

  const [activeTab, setActiveTab] = useState<number>(1);
  const [errors, setErrors] = useState<InschrijvingErrorInterface>({});

  const onSubmit = async (values: FieldValues) => {
    values.training_id = 1;
    values.klant_id = localStorage.getItem("id");
    values.datum = values.datum[0];
    const { data, error } = await inschrijving(
      POST_INSCHRIJVING,
      values,
      errors,
      setErrors
    );
    if (error) console.log(error);
    else if (data) router.push(INDEX);
  };
  return (
    <section className={SECTION_DARKER}>
      <Form
        onSubmit={handleSubmit(onSubmit)}
        title={
          activeTab === 1
            ? "Wanneer wilt u een prive training reserveren?"
            : activeTab === 2
            ? "Voor welke hond is deze inschrijving?"
            : ""
        }
        tabCount={2}
        setActiveTab={setActiveTab}
      >
        {activeTab === 1 ? (
          <Step1
            control={control}
            setActiveTab={setActiveTab}
            disabledDays={disabledDays}
            errors={errors}
            setErrors={setErrors}
          />
        ) : activeTab === 2 ? (
          <Step2
            control={control}
            setActiveTab={setActiveTab}
            honden={honden}
          />
        ) : null}
      </Form>
    </section>
  );
};

export default Privelessen;

export const getServerSideProps = async () => {
  const { data: honden } = await getData(KLANT_HONDEN, { klantId: 5 });
  const { data: inschrijvingen } = await getData(GET_FUTURE_INSCHRIJVINGS);
  const disabledDays = inschrijvingen.map(
    (inschrijving: any) => inschrijving.datum
  );
  return {
    props: {
      honden,
      disabledDays,
    },
  };
};
