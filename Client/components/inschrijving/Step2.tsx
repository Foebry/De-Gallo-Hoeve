import React, { useEffect } from "react";
import getData from "../../hooks/useApi";
import { KLANT_HONDEN } from "../../types/apiTypes";
import Button, { SubmitButton } from "../buttons/Button";
import FormRow from "../form/FormRow";
import { FormStepProps } from "../form/FormTabs";
import Hond from "../Hond";

interface Props extends FormStepProps {
  honden?: any;
}

const Step2: React.FC<Props> = ({
  control,
  setActiveTab,
  honden,
  setErrors,
  errors,
}) => {
  useEffect(() => {
    console.log(honden);
  }, []);
  return (
    <>
      {honden.map(({ naam, avatar, id }: any, index: number) => (
        <Hond
          control={control}
          naam={naam}
          index={index}
          avatar={avatar}
          id={id}
          errors={errors}
          setErrors={setErrors}
        />
      ))}
      <FormRow>
        <Button
          type="form"
          className="left-14 right-auto"
          label="vorige"
          onClick={() => setActiveTab(1)}
        />
        <SubmitButton label="Aanvragen" />
      </FormRow>
    </>
  );
};

export default Step2;
