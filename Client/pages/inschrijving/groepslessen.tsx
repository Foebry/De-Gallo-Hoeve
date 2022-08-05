import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import Step1, { Session } from "../../components/inschrijving/Step1";
import Step2 from "../../components/inschrijving/Step2";
import useMutation from "../../hooks/useMutation";
import { POST_INSCHRIJVING } from "../../types/apiTypes";
import { INDEX } from "../../types/linkTypes";
import { InschrijvingErrorInterface, LessenProps } from "./privelessen";
import { validator } from "../../middleware/Validator";
import db, { conn } from "../../middleware/db";
import FormSteps from "../../components/form/FormSteps";

const Groepslessen: React.FC<LessenProps> = ({ honden, sessions }) => {
  const router = useRouter();

  const { handleSubmit, control, getValues } = useForm();
  const inschrijving = useMutation();

  const [activeStep, setActiveStep] = useState<number>(0);
  const [errors, setErrors] = useState<InschrijvingErrorInterface>({});
  const [errorSteps, setErrorSteps] = useState<number[]>([]);

  const onSubmit = async (values: FieldValues) => {
    values.training_id = 2;
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
    <section className="mx-5 mdl:mx-auto">
      <FormSteps
        steps={["Selecteer datum", "Selecteer hond"]}
        activeStep={activeStep}
        errorSteps={errorSteps}
        setActiveStep={setActiveStep}
      />
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-8xl mx-auto">
        {activeStep === 0 ? (
          <Step1
            control={control}
            setActiveStep={setActiveStep}
            errors={errors}
            setErrors={setErrors}
            sessions={sessions as Session[]}
          />
        ) : activeStep === 1 ? (
          <Step2
            control={control}
            setActiveStep={setActiveStep}
            honden={honden}
            values={getValues}
            errors={errors}
            setErrors={setErrors}
          />
        ) : null}
      </form>
    </section>
  );
};

export default Groepslessen;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const verifiedToken = validator.securePage(ctx);
  if (Object.keys(verifiedToken).includes("payload")) {
    const klant_id = verifiedToken.payload.id;
    const honden = await db.query({
      builder: conn.select("*").from("hond").where({ klant_id }),
    });

    interface Subscription {
      aantal: Number;
    }

    const createSession = async (date: string) => {
      const inschrijvingen = (await db.query({
        builder: conn
          .select("datum as aantal")
          .count("datum as aantal")
          .from("inschrijving")
          .where({ datum: date })
          .first(),
      })) as Subscription;
      return {
        date,
        spots: 10,
        subscriptons: inschrijvingen.aantal,
      };
    };
    const nextGroupSessions = db.getThisMonthsGroupSessions(new Date());
    const sessions = await Promise.all(
      nextGroupSessions.map(async (date: string) => await createSession(date))
    );

    return {
      props: {
        honden,
        sessions,
      },
    };
  }
  return { props: { disabledDays: [], honden: [], sessions: [] } };
};
