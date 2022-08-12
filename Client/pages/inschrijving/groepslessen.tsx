import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import Step2 from "../../components/inschrijving/Step2";
import useMutation from "../../hooks/useMutation";
import { POST_INSCHRIJVING } from "../../types/apiTypes";
import { INDEX, LOGIN } from "../../types/linkTypes";
import { InschrijvingErrorInterface, LessenProps } from "./privelessen";
import db, { conn } from "../../middleware/db";
import FormSteps from "../../components/form/FormSteps";
import Form from "../../components/form/Form";
import { Body, FormError } from "../../components/Typography/Typography";
import Link from "next/link";
import { authenticatedUser } from "../../middleware/CookieHandler";
import { RegisterHondInterface } from "../../types/formTypes/registerTypes";
import FormRow from "../../components/form/FormRow";
import Button, { SubmitButton } from "../../components/buttons/Button";
import { DatePicker } from "react-trip-date";
import { refreshCsrf } from "../../middleware/Validator";
import FormInput from "../../components/form/FormInput";
import Contactgegevens from "../../components/inschrijving/Contactgegevens";
import { toast } from "react-toastify";

const Groepslessen: React.FC<LessenProps> = ({
  honden,
  disabledDays,
  klant_id,
  rassen,
  csrf,
}) => {
  const router = useRouter();

  const { handleSubmit, control, getValues, register } = useForm();
  const inschrijving = useMutation();

  const [activeStep, setActiveStep] = useState<number>(0);
  const [errors, setErrors] = useState<InschrijvingErrorInterface>({
    inschrijvingen: [],
    email: "",
  });
  const [errorSteps, setErrorSteps] = useState<number[]>([]);

  const steps = useMemo(() => {
    return klant_id
      ? ["Selecteer datum(s)", "Selecteer hond"]
      : ["Selecteer datum(s)", "Gegevens hond", "Contactgegevens"];
  }, [klant_id]);

  const onSubmit = async (values: FieldValues) => {
    const { data, error } = await inschrijving(
      POST_INSCHRIJVING,
      { ...values, csrf, klant_id: klant_id ?? 0, training_id: 2 },
      errors,
      setErrors
    );
    if (data) {
      toast.success(data.message);
      router.push(INDEX);
    }
  };
  return (
    <section className="mx-5 pb-24 md:mx-auto">
      {!klant_id && (
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
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="max-w-3xl mx-0 md:mx-auto mt-20 mb-30">
            {activeStep === 0 ? (
              <>
                <Controller
                  name="datum"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <DatePicker
                      onChange={onChange}
                      disabledBeforeToday={true}
                      numberOfSelectableDays={5}
                      startOfWeek={1}
                      disabledDays={disabledDays}
                      selectedDays={getValues().datum}
                    />
                  )}
                />
              </>
            ) : activeStep === 1 ? (
              <Step2
                control={control}
                register={register}
                rassen={rassen}
                values={getValues}
                errors={errors}
                setErrors={setErrors}
                selectedDates={getValues().datum}
                honden={honden}
              />
            ) : activeStep === 2 ? (
              <Contactgegevens control={control} />
            ) : null}
          </div>
          <FormRow className="max-w-3xl mx-auto">
            <Button
              label="vorige stap"
              onClick={() => setActiveStep(activeStep - 1)}
              disabled={activeStep === 0}
            />
            {(activeStep === 1 && klant_id) || activeStep === 2 ? (
              <SubmitButton label="inschrijven" />
            ) : (
              <Button
                label="volgende stap"
                onClick={() => setActiveStep(activeStep + 1)}
              />
            )}
          </FormRow>
        </Form>
      </div>
    </section>
  );
};

export default Groepslessen;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return authenticatedUser(ctx, async (klant_id?: number) => {
    let honden = [] as RegisterHondInterface[];
    const csrf = refreshCsrf();
    const disabledDays = db.getDisabledDays("groep");
    const rassen = await db.query({
      builder: conn.select("id as value", "naam as label").from("ras"),
    });

    if (klant_id) {
      honden = (await db.query({
        builder: conn
          .select("id as value", "naam as label")
          .from("hond")
          .where({ klant_id }),
      })) as RegisterHondInterface[];
    }
    return {
      props: {
        rassen,
        honden: honden ?? [],
        disabledDays,
        klant_id: klant_id ?? null,
        csrf,
      },
    };
  });
};
