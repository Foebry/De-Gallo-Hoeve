import React, { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import Form from "../../components/form/Form";
import Step1 from "../../components/inschrijving/Step1";
import Step2 from "../../components/inschrijving/Step2";
import getData from "../../hooks/useApi";
import useMutation from "../../hooks/useMutation";
import { KLANT_HONDEN } from "../../types/apiTypes";
import { RegisterHondInterface } from "../../types/formTypes/registerTypes";
import { SECTION_DARKER } from "../../types/styleTypes";

interface PriveLessenProps {
  honden: RegisterHondInterface[];
}

const Privelessen: React.FC<PriveLessenProps> = ({ honden }) => {
  const { handleSubmit, control } = useForm();
  const inschrijving = useMutation();

  const [activeTab, setActiveTab] = useState<number>(1);

  const onSubmit = (values: FieldValues) => {
    console.log(values);
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
          <Step1 control={control} setActiveTab={setActiveTab} />
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
  return {
    props: {
      honden,
    },
  };
};
