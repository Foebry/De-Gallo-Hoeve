import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import Step1, { Session } from "../../components/inschrijving/Step1";
import Step2 from "../../components/inschrijving/Step2";
import useMutation from "../../hooks/useMutation";
import { POST_INSCHRIJVING } from "../../types/apiTypes";
import { INDEX, LOGIN } from "../../types/linkTypes";
import { InschrijvingErrorInterface, LessenProps } from "./privelessen";
import db, { conn } from "../../middleware/db";
import FormSteps from "../../components/form/FormSteps";
import Form from "../../components/form/Form";
import { Body } from "../../components/Typography/Typography";
import Link from "next/link";
import { authenticatedUser } from "../../middleware/CookieHandler";
import { RegisterHondInterface } from "../../types/formTypes/registerTypes";
import FormRow from "../../components/form/FormRow";
import Button from "../../components/buttons/Button";
import { parseCookies } from "nookies";

const Groepslessen: React.FC<LessenProps> = ({ honden, trainingsmomenten }) => {
  const router = useRouter();

  const { handleSubmit, control, getValues } = useForm();
  const inschrijving = useMutation();

  const [activeStep, setActiveStep] = useState<number>(0);
  const [errors, setErrors] = useState<InschrijvingErrorInterface>({});
  const [errorSteps, setErrorSteps] = useState<number[]>([]);

  const loggedIn = useMemo(() => {
    const cookies = parseCookies();
    return cookies.Client ? true : false;
  }, [parseCookies()]);

  const steps = useMemo(() => {
    return loggedIn
      ? ["Selecteer datum", "Selecteer hond", "Betalen"]
      : [
          "Selecteer datum",
          "Gegevens hond",
          "Persoonlijke gegevens",
          "Betalen",
        ];
  }, [loggedIn]);

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
      {!loggedIn && (
        <div className="max-w-7xl mx-auto mt-14 mb-20 border-2 rounded border-green-300 py-2 px-5 bg-green-200">
          <Body className="text-center text-gray-200">
            Wist u dat u op een eenvoudigere manier zich kan inschrijven door
            eerst{" "}
            <span className="cursor-pointer underline">
              <Link href={LOGIN}>in te loggen</Link>
            </span>
          </Body>
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        <FormSteps
          steps={steps}
          activeStep={activeStep}
          errorSteps={errorSteps}
          setActiveStep={setActiveStep}
        />
        <div className="max-w-3xl mx-auto mt-10">
          <Form onSubmit={handleSubmit(onSubmit)}>
            {activeStep === 0 ? (
              <Step1
                control={control}
                setActiveStep={setActiveStep}
                errors={errors}
                setErrors={setErrors}
                trainingsmomenten={trainingsmomenten as Session[]}
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
          </Form>
        </div>
        <FormRow className="flex-row-reverse">
          <Button label="volgende stap" />
        </FormRow>
      </div>
    </section>
  );
};

export default Groepslessen;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return authenticatedUser(ctx, async (klant_id: number | undefined) => {
    let props = {
      honden: [] as any[],
    };
    if (klant_id) {
      const honden = (await db.query({
        builder: conn.select("*").from("hond").where({ klant_id }),
      })) as RegisterHondInterface[];
      props = {
        ...props,
        honden: honden,
      };
    }
    const data = db.getNextGroupTrainings();
    const trainingsmomenten = await Promise.all(
      data.map(async (datum) => {
        const inschrijvingen = (await db.query({
          builder: conn
            .select("datum as aantal")
            .count("datum as aantal")
            .from("inschrijving")
            .where({ datum })
            .andWhere({ training_id: 2 })
            .first(),
        })) as Subscription;
        return {
          date: datum,
          spots: 10,
          subscriptions: inschrijvingen.aantal,
        };
      })
    );
    return {
      props: { ...props, trainingsmomenten },
    };
  });

  interface Subscription {
    aantal: Number;
  }
};
