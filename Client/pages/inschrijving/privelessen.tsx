import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { OptionsOrGroups } from "react-select";
import Form from "../../components/form/Form";
import Step2 from "../../components/inschrijving/Step2";
import { optionInterface } from "../../components/register/step2";
import getData from "../../hooks/useApi";
import useMutation from "../../hooks/useMutation";
import db, { conn } from "../../middleware/db";
import { validator } from "../../middleware/Validator";
import {
  GET_FUTURE_INSCHRIJVINGS,
  KLANT_HONDEN,
  POST_INSCHRIJVING,
} from "../../types/apiTypes";
import { INDEX } from "../../types/linkTypes";
import { SECTION_DARKER } from "../../types/styleTypes";

export interface LessenProps {
  honden: any;
  disabledDays?: string[];
  loggedIn: boolean;
  rassen: OptionsOrGroups<any, optionInterface>[];
}

export interface InschrijvingErrorInterface {
  hond_id?: number;
  training_id?: number;
  klant_id?: number;
  datum?: string;
}

const Privelessen: React.FC<LessenProps> = ({ disabledDays, honden }) => {
  const router = useRouter();

  const { handleSubmit, control, getValues } = useForm();
  const inschrijving = useMutation();

  const [activeStep, setActiveStep] = useState<number>(1);
  const [errors, setErrors] = useState<InschrijvingErrorInterface>({});
  // const [honden, setHonden] = useState<RegisterHondInterface[]>([]);

  // useEffect(() => {
  //   (async () => {
  //     const klant_id = localStorage.getItem("id");
  //     const { data } = await getData(KLANT_HONDEN, { klant_id });
  //     setHonden(data);
  //   })();
  // }, []);

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
        setActiveStep={setActiveStep}
        steps={["Selecteer datum", "selecteer hond"]}
      >
        {activeStep === 1 ? (
          <></>
        ) : activeStep === 2 ? (
          <Step2
            control={control}
            rassen={honden}
            values={getValues}
            errors={errors}
            setErrors={setErrors}
            selectedDates={[]}
          />
        ) : null}
      </Form>
    </section>
  );
};

export default Privelessen;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const verifiedToken = validator.securePage(ctx);

  const klant_id = verifiedToken.payload.id;

  const honden = await db.query({
    builder: conn.select("*").from("hond").where({ klant_id }),
  });

  const { data: inschrijvingen } = await getData(GET_FUTURE_INSCHRIJVINGS);
  const disabledDays = inschrijvingen.map(
    (inschrijving: any) => inschrijving.datum
  );
  return {
    props: {
      disabledDays,
      honden,
    },
  };
};
