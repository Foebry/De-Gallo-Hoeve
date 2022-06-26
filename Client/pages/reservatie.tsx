import { useRouter } from "next/router";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import Form from "../components/form/Form";
import Step1 from "../components/reservatie/Step1";
import Step2 from "../components/reservatie/Step2";
import { Title3 } from "../components/Typography/Typography";
import { AppContext } from "../context/appContext";
import getData from "../hooks/useApi";
import useMutation, {
  handleErrors,
  structureDetailsPayload,
} from "../hooks/useMutation";
import { KLANT_HONDEN, RESERVATIEAPI } from "../types/apiTypes";
import { INDEX, LOGIN } from "../types/linkTypes";

interface ReservatieProps {}

interface ReservatieErrorInterface {
  start?: string;
  eind?: string;
  hond_id?: string;
  medicatie?: string;
  ontsnapping?: string;
  sociaal?: string;
}

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
  const [formErrors, setFormErrors] = useState<ReservatieErrorInterface>({});
  useEffect(() => {
    const id = localStorage.getItem("id");
    setKlantId(id);
  }, []);
  const { setModal } = useContext(AppContext);

  const step1 = ["hond_id", "medicatie", "ontsnapping", "sociaal"];

  const handleErrors = (error: any) => {
    if (Object.keys(error).some((r) => step1.indexOf(r) >= 0)) setActiveTab(1);
  };

  const onSubmit = async (values: any) => {
    values = structureDetailsPayload(values);
    values.klant_id = klantId;
    values.csrf = process.env.NEXT_PUBLIC_CSRF;
    const { data, error } = await makeReservation(
      RESERVATIEAPI,
      values,
      formErrors,
      setFormErrors
    );
    if (error) handleErrors(error);
    else {
      setModal({ active: true, message: data.success, type: "success" });
      router.push(INDEX);
    }
  };

  return (
    <section className="bg-grey-700 px-5 py-5">
      <Form
        className="md:w-10/12"
        onSubmit={handleSubmit(onSubmit)}
        title={
          !klantId
            ? "U bent niet ingelogd"
            : activeTab === 1
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
            errors={formErrors}
            setErrors={setFormErrors}
          />
        ) : activeTab === 2 ? (
          <Step2
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

export default Reservatie;
