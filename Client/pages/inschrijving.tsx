import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import useMutation, {
  structureInschrijvingenPayload,
} from "../hooks/useMutation";
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
import {
  getFreeTimeSlots,
  getHondOptions,
  getRasOptions,
} from "../middleware/MongoDb";
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
  timeslots: any;
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
  timeslots,
}) => {
  const [errors, setErrors] = useState<InschrijvingErrorInterface>({});
  const [activeStep, setActiveStep] = useState<number>(0);
  const [errorSteps, setErrorSteps] = useState<number[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  const router = useRouter();
  const { handleSubmit, control, getValues, register, setValue } = useForm();
  const inschrijving = useMutation(errors, setErrors);

  const steps = useMemo(() => {
    return klant_id
      ? ["Selecteer datum(s)", "Selecteer hond"]
      : ["Selecteer datum(s)", "Gegevens hond", "Contactgegevens"];
  }, [klant_id]);

  const handleDelete = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const index = parseInt(e.currentTarget.dataset.id ?? "-1");
    if (index >= 0) {
      console.log(getValues().inschrijvingen[index]);
      const el = selectedDates[index];
      setSelectedDates(() =>
        selectedDates.filter((date: string) => date !== el)
      );
      setValue("inschrijvingen", {
        ...getValues().inschrijvingen,
        [index]: null,
      });
    }
  };

  const onSubmit = async (values: FieldValues) => {
    const payload = structureInschrijvingenPayload(values);
    const { data, error } = await inschrijving(POST_INSCHRIJVING, {
      ...payload,
      csrf,
      klant_id,
      training: type,
    });
    if (error?.code === 401) router.push(LOGIN);
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
                  name="dates"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <DatePicker
                      onChange={(e) => {
                        onChange(e);
                        setSelectedDates(
                          getValues().dates.sort(
                            (a: string, b: string) =>
                              new Date(a).getTime() - new Date(b).getTime()
                          )
                        );
                        setValue("inschrijvingen", []);
                      }}
                      disabledBeforeToday={true}
                      numberOfSelectableDays={5}
                      startOfWeek={1}
                      disabledDays={disabledDays}
                      selectedDays={selectedDates}
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
                selectedDates={selectedDates}
                honden={honden}
                type={type}
                handleDelete={handleDelete}
                timeslots={timeslots}
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
  // const { type } = ctx.query;
  const type = "prive";
  if (!type) return { redirect: { permanent: false, destination: INDEX } };

  return securepage(ctx, async (klant_id: ObjectId) => {
    let honden = klant_id ? await getHondOptions(klant_id) : [];
    const csrf = generateCsrf();
    const disabledDays = await getDisabledDays(type as string);
    const rassen = await getRasOptions();
    const timeslots = await getFreeTimeSlots();
    console.log({ timeslots: timeslots["2022-08-26"] });

    return {
      props: {
        rassen,
        honden,
        disabledDays,
        klant_id: klant_id?.toString() ?? null,
        csrf,
        type,
        timeslots,
      },
    };
  });
};
