import React, { useEffect } from "react";
import Dashboard from "src/components/admin/dashboard";
import { Body, Title2, Title3 } from "src/components/Typography/Typography";
import { DatePicker } from "react-trip-date";
import { Controller, useForm } from "react-hook-form";
import getData from "src/hooks/useApi";
import Button from "src/components/buttons/Button";
import useMutation from "src/hooks/useMutation";
import { toast } from "react-toastify";

interface Props {}

const Trainingdagen: React.FC<Props> = ({}) => {
  const { control, getValues, setValue } = useForm();
  const save = useMutation();
  useEffect(() => {
    (async () => {
      const { data } = await getData("/api/admin/trainingdays");
      setValue("selected", data);
    })();
  }, []);

  const onSubmit = async () => {
    const values = getValues();
    const { error, data } = await save("/api/admin/trainingdays", values);
    if (data) {
      toast.success("save succesvol");
      setValue("selected", data);
    }
    if (error) {
      toast.error(error);
    }
  };
  return (
    <Dashboard>
      <div className="flex flex-row-reverse mt-10 mr-10">
        <Button label="save" onClick={onSubmit} />
      </div>
      <div className="max-w-7xl mx-auto text-center text-green-200">
        <Title2>Pas hier de beschikbare dagen aan</Title2>
        <Title3>Beschikbare data staan aangeduidt in een groene bol.</Title3>
        <Body>
          Om een dag als beschikbaar aan te duiden, klik op de bepaalde dag om
          deze te selecteren.
        </Body>
        <Body>Alle niet geslecteerde dagen zullen niet beschikbaar zijn</Body>
        <Body>
          Standaard worden alle beschikbare dagen steeds opengezet vanaf 10:00
          tot en met 17:00
        </Body>
      </div>
      <div className="max-w-3xl mx-auto mt-10">
        <Controller
          name="selected"
          control={control}
          render={({ field: { onChange, value } }) => (
            <DatePicker
              onChange={onChange}
              selectedDays={value}
              disabledBeforeToday={true}
              startOfWeek={1}
            />
          )}
        />
      </div>
    </Dashboard>
  );
};

export default Trainingdagen;
