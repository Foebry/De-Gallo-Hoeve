import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import Form from "../../components/form/Form";
import Step1 from "../../components/inschrijving/Step1";
import Step2 from "../../components/inschrijving/Step2";
import { AppContext } from "../../context/appContext";
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
import { InschrijvingErrorInterface, LessenProps } from "./privelessen";

const Groepslessen: React.FC<LessenProps> = () => {
  const router = useRouter();

  const { handleSubmit, control, getValues } = useForm();
  const inschrijving = useMutation();

  const [activeTab, setActiveTab] = useState<number>(1);
  const [errors, setErrors] = useState<InschrijvingErrorInterface>({});
  const [honden, setHonden] = useState<RegisterHondInterface[]>([]);
  const [disabledDays, setDisabledDays] = useState<string[]>([]);
  const { setModal } = useContext(AppContext);

  useEffect(() => {
    (async () => {
      const klant_id = localStorage.getItem("id");
      const { data: honden } = await getData(KLANT_HONDEN, { klant_id });
      const {
        data: { groep: disabledDays },
      } = await getData(GET_FUTURE_INSCHRIJVINGS);
      setHonden(honden);
      setDisabledDays(disabledDays);
    })();
  }, []);

  const onSubmit = async (values: FieldValues) => {
    values.training_id = 2;
    values.klant_id = localStorage.getItem("id");
    values.datum = values.datum[0];
    values.csrf = process.env.NEXT_PUBLIC_CSRF;
    const { data, error } = await inschrijving(
      POST_INSCHRIJVING,
      values,
      errors,
      setErrors
    );
    if (error) console.log(error);
    else if (data) {
      setModal({ active: true, message: data.success, type: "success" });
      router.push(INDEX);
    }
  };
  return (
    <section className={SECTION_DARKER}>
      <Form
        onSubmit={handleSubmit(onSubmit)}
        title={
          activeTab === 1
            ? "Kies de datum waarop u een les wil bijwonen"
            : activeTab === 2
            ? "Welke hond zal je voor deze les meenemen?"
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
            values={getValues}
          />
        ) : null}
      </Form>
    </section>
  );
};

export default Groepslessen;
