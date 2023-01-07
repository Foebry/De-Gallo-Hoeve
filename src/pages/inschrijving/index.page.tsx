import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import useMutation, {
  structureInschrijvingenPayload,
} from "src/hooks/useMutation";
import { POST_INSCHRIJVING } from "src/types/apiTypes";
import { INDEX, LOGIN } from "src/types/linkTypes";
import FormSteps from "src/components/form/FormSteps";
import Form from "src/components/form/Form";
import Button, { SubmitButton } from "src/components/buttons/Button";
import { DatePicker } from "react-trip-date";
import Contactgegevens from "src/components/inschrijving/Contactgegevens";
import { toast } from "react-toastify";
import { OptionsOrGroups } from "react-select";
import { optionInterface } from "src/components/register/HondGegevens";
import HondGegevens from "src/components/inschrijving/HondGegevens";
import client, {
  getFreeTimeSlots,
  getHondOptions,
  getRasOptions,
} from "src/utils/MongoDb";
import { ObjectId } from "mongodb";
import { getDisabledDays } from "src/shared/functions";
import { generateCsrf } from "src/services/Validator";
import { securepage } from "src/services/Authenticator";
import Skeleton from "src/components/website/skeleton";
import { getPriveTraining } from "src/controllers/TrainingController";
import getData from "src/hooks/useApi";

type TrainingType = "prive" | "groep";

interface LessenProps {
  honden: OptionsOrGroups<any, optionInterface>[];
  disabledDays?: string[];
  klant_id?: number;
  rassen: OptionsOrGroups<any, optionInterface>[];
  csrf: string;
  type: TrainingType;
  timeslots: any;
  prijsExcl: number;
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
  prijsExcl,
}) => {
  const [errors, setErrors] = useState<InschrijvingErrorInterface>({});
  const [activeStep, setActiveStep] = useState<number>(0);
  const [errorSteps, setErrorSteps] = useState<number[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [isFirstInschrijving, setIsFirstInschrijving] = useState<boolean>(true);

  const router = useRouter();
  const { handleSubmit, control, getValues, register, setValue } = useForm();
  const inschrijving = useMutation(errors, setErrors);

  useEffect(() => {
    (async () => {
      const { data: mijnInschrijvingen } = await getData("/api/inschrijvingen");
      if (!mijnInschrijvingen) {
        setIsFirstInschrijving(true);
        return;
      } else {
        if (mijnInschrijvingen.length > 0) setIsFirstInschrijving(false);
        else setIsFirstInschrijving(true);
      }
    })();
  }, []);

  const steps = useMemo(() => {
    return klant_id
      ? ["Selecteer datum(s)", "Selecteer hond"]
      : ["Selecteer datum(s)", "Gegevens hond", "Contactgegevens"];
  }, [klant_id]);

  const handleNextPageClick = () => {
    const hasDatesSelected = getValues().dates && getValues().dates.length > 0;
    if (hasDatesSelected && activeStep === 0) {
      setActiveStep(activeStep + 1);
    } else if (activeStep === 0 && !hasDatesSelected) {
      toast.error("Gelieve minstens 1 datum te kiezen");
    }
  };

  const handleDelete = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const index = parseInt(e.currentTarget.dataset.id ?? "-1");
    if (index >= 0) {
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
    const [payload, newErrors] = structureInschrijvingenPayload(values);
    if (!disabled) {
      setDisabled(() => true);
      if (Object.keys(newErrors).length > 0) {
        setDisabled(false);
        return setErrors(newErrors);
      }
      const { data, error } = await inschrijving(POST_INSCHRIJVING, {
        ...payload,
        csrf,
        klant_id,
        training: type,
        prijs: prijsExcl,
        isFirstInschrijving,
      });
      if (error) {
        if (error.code === 401) router.push(LOGIN);
      }
      if (data) {
        toast.success(data.message);
        router.push(INDEX);
      }
      setDisabled(() => false);
    }
  };

  return (
    <>
      <title>De Gallo-hoeve - inschrijving privétraining</title>
      <meta
        name="description"
        content="Maak nu een nieuwe afspraak. Selecteer de datum en het tijdstap waarop u een trainng wil boeken. Selecteer vervolgens voor welke hond u deze training wil boeken. U ontvangt een email ter bevestiging van uw inschrijving."
        key="description inschrijving"
      ></meta>
      <Skeleton>
        <section className="mb-48 md:px-5 mt-20">
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
                          disabledAfterDate={
                            disabledDays?.[disabledDays?.length - 1]
                          }
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
            </Form>
            {activeStep > 0 && (
              <div className="absolute left-10 top-20">
                <Button
                  label="vorige"
                  onClick={() => setActiveStep(activeStep - 1)}
                />
              </div>
            )}
            <div className="absolute right-10 top-20">
              {activeStep === 1 ? (
                <SubmitButton
                  label="verzend"
                  onClick={() => onSubmit(getValues())}
                />
              ) : (
                <Button label="volgende" onClick={handleNextPageClick} />
              )}
            </div>
          </div>
        </section>
      </Skeleton>
    </>
  );
};

export default Groepslessen;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // const { type } = ctx.query;
  const type = "prive";
  if (!type) return { redirect: { permanent: false, destination: INDEX } };

  const klant_id = await securepage(ctx);

  if (!klant_id) {
    return {
      redirect: { permanent: false, destination: LOGIN },
    };
  }
  await client.connect();
  const honden = await getHondOptions(klant_id as ObjectId);
  const csrf = generateCsrf();
  const disabledDays = await getDisabledDays(type);
  const rassen = await getRasOptions();
  const timeslots = await getFreeTimeSlots();
  const { prijsExcl } = await getPriveTraining();
  await client.close();

  return {
    props: {
      rassen,
      honden,
      disabledDays,
      klant_id: klant_id?.toString() ?? null,
      csrf,
      type,
      timeslots,
      prijsExcl,
    },
  };
};
