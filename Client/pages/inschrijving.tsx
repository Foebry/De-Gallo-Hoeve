import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import useMutation from "../hooks/useMutation";
import { POST_INSCHRIJVING } from "../types/apiTypes";
import { INDEX, LOGIN } from "../types/linkTypes";
import FormSteps from "../components/form/FormSteps";
import Form from "../components/form/Form";
import { Body } from "../components/Typography/Typography";
import Link from "next/link";
import FormRow from "../components/form/FormRow";
import Button, { SubmitButton } from "../components/buttons/Button";
import { DatePicker } from "react-trip-date";
import Contactgegevens from "../components/inschrijving/Contactgegevens";
import { toast } from "react-toastify";
import { OptionsOrGroups } from "react-select";
import { optionInterface } from "../components/register/HondGegevens";
import HondGegevens from "../components/inschrijving/HondGegevens";
import { getHondOptions, getRasOptions } from "../middleware/MongoDb";
import { ObjectId } from "mongodb";
import { getDisabledDays } from "../middleware/Helper";
import { generateCsrf } from "../handlers/validationHelper";
import { securepage } from "../handlers/authenticationHandler";

type TrainingType = "prive" | "groep";

interface LessenProps {
  honden: OptionsOrGroups<any, optionInterface>[];
  disabledDays?: string[];
  klant_id?: number;
  rassen: OptionsOrGroups<any, optionInterface>[];
  csrf: string;
  type: TrainingType;
}

export interface InschrijvingErrorInterface {
  inschrijvingen?: {
    datum: string;
    hond_naam?: string;
    hond_ras?: number;
    hond_geslacht?: string;
  }[];
  email?: string;
  aanspreking?: string;
  naam?: string;
}

const Groepslessen: React.FC<LessenProps> = ({
  honden,
  disabledDays,
  klant_id,
  rassen,
  csrf,
  type,
}) => {
  const [errors, setErrors] = useState<InschrijvingErrorInterface>({});
  const [activeStep, setActiveStep] = useState<number>(0);
  const [errorSteps, setErrorSteps] = useState<number[]>([]);

  const router = useRouter();
  const { handleSubmit, control, getValues, register } = useForm();
  const inschrijving = useMutation(errors, setErrors);

  const steps = useMemo(() => {
    return klant_id
      ? ["Selecteer datum(s)", "Selecteer hond"]
      : ["Selecteer datum(s)", "Gegevens hond", "Contactgegevens"];
  }, [klant_id]);

  const onSubmit = async (values: FieldValues) => {
    const { data, error } = await inschrijving(POST_INSCHRIJVING, {
      ...values,
      csrf,
      klant_id: klant_id ?? 0,
      training_id: 2,
    });
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
              <HondGegevens
                control={control}
                register={register}
                rassen={rassen}
                values={getValues}
                errors={errors}
                setErrors={setErrors}
                selectedDates={getValues().datum}
                honden={honden}
                type={type}
              />
            ) : activeStep === 2 ? (
              <Contactgegevens control={control} />
            ) : null}
          </div>
          <FormRow className="max-w-3xl mx-auto">
            <Button
              label="vorige"
              onClick={() => setActiveStep(activeStep - 1)}
              disabled={activeStep === 0}
            />
            {(activeStep === 1 && klant_id) || activeStep === 2 ? (
              <SubmitButton label="inschrijven" />
            ) : (
              <Button
                label="volgende"
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
  const { type } = ctx.query;
  if (!type) return { redirect: { permanent: false, destination: INDEX } };

  return securepage(ctx, async (klant_id: ObjectId) => {
    let honden = klant_id ? await getHondOptions(klant_id) : [];
    const csrf = generateCsrf();
    const disabledDays = await getDisabledDays(type as string);
    const rassen = await getRasOptions();

    return {
      props: {
        rassen,
        honden,
        disabledDays,
        klant_id: klant_id?.toString() ?? null,
        csrf,
        type,
      },
    };
  });
};
