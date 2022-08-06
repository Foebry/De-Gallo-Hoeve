import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import Step1, { Session } from "../../components/inschrijving/Step1";
import Step2 from "../../components/inschrijving/Step2";
import useMutation from "../../hooks/useMutation";
import { POST_INSCHRIJVING } from "../../types/apiTypes";
import { INDEX, LOGIN } from "../../types/linkTypes";
import { InschrijvingErrorInterface, LessenProps } from "./privelessen";
import { validator } from "../../middleware/Validator";
import db, { conn } from "../../middleware/db";
import FormSteps from "../../components/form/FormSteps";
import Form from "../../components/form/Form";
import { Body } from "../../components/Typography/Typography";
import Link from "next/link";
import { controller } from "../../middleware/Controller";
import { RegisterHondInterface } from "../../types/formTypes/registerTypes";

const Groepslessen: React.FC<LessenProps> = ({ honden, trainingsmomenten }) => {
  useEffect(() => {
    console.log(trainingsmomenten);
  }, []);
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
      <div className="max-w-7xl mx-auto my-14 border-2 rounded border-green-300 py-2 px-5 bg-green-200">
        <Body className="text-center text-gray-200">
          Wist u dat u op een eenvoudigere manier zich kan inschrijven door
          eerst{" "}
          <span className="cursor-pointer underline">
            <Link href={LOGIN}>in te loggen</Link>
          </span>
        </Body>
      </div>
      <div className="max-w-7xl mx-auto border-2 rounded">
        <FormSteps
          steps={["Selecteer datum", "Selecteer hond"]}
          activeStep={activeStep}
          errorSteps={errorSteps}
          setActiveStep={setActiveStep}
        />
        <Form onSubmit={handleSubmit(onSubmit)}>
          {activeStep === 0 ? (
            <Step1
              control={control}
              setActiveStep={setActiveStep}
              errors={errors}
              setErrors={setErrors}
              sessions={trainingsmomenten as Session[]}
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
    </section>
  );
};

export default Groepslessen;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return controller.authenticatedUser(
    ctx,
    async (klant_id: number | undefined) => {
      let props = { honden: [] as any[] };
      if (klant_id) {
        const honden = (await db.query({
          builder: conn.select("*").from("hond").where({ klant_id }),
        })) as RegisterHondInterface[];
        props = { ...props, honden: honden };
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
              .andWhere({ id: 0 })
              .first(),
          })) as Subscription;
          return {
            datum,
            spots: 10,
            subscriptions: inschrijvingen.aantal,
          };
        })
      );
      return {
        props: { ...props, trainingsmomenten },
      };
    }
  );

  interface Subscription {
    aantal: Number;
  }
};
