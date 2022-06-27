import React, { useEffect, useMemo, useState } from "react";
import {
  FieldValues,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from "react-hook-form";
import Button from "../buttons/Button";
import Select, { OptionsOrGroups } from "react-select";
import { FormStepProps } from "../form/FormTabs";
import Hond from "../Hond";
import { KLANT_HONDEN } from "../../types/apiTypes";
import getData from "../../hooks/useApi";
import { Link, Title1, Title3 } from "../Typography/Typography";
import { LOGIN } from "../../types/linkTypes";
import FormRow from "../form/FormRow";

interface SelectionInterface {
  id: number;
  naam: string;
}
interface OptionInterface {
  options: [
    {
      label: string;
      value: number;
    }
  ];
}

interface Props extends FormStepProps {
  fields: Record<"id", string>[];
  append: UseFieldArrayAppend<FieldValues, "details">;
  remove: UseFieldArrayRemove;
  values: any;
}

const Step1: React.FC<Props> = ({
  control,
  setActiveTab,
  fields,
  append,
  remove,
  values,
  errors,
  setErrors,
}) => {
  const [available, setAvailable] = useState<
    OptionsOrGroups<any, OptionInterface>
  >([]);
  const [selectedHonden, setSelectedHonden] = useState<SelectionInterface[]>(
    []
  );
  const [klantId, setKlantId] = useState<string | null>();
  const [honden, setHonden] = useState([]);

  useEffect(() => {
    const id = localStorage.getItem("id");
    setKlantId(id);
    (async () => {
      const { data } = await getData(KLANT_HONDEN, { klantId });
      setHonden(data);
    })();
  }, [klantId]);

  const options = useMemo(() => {
    return honden.map(({ naam: label, id: value, avatar }: any) => ({
      label,
      value,
      avatar,
    }));
  }, [honden]);

  useEffect(() => {
    setAvailable(options);
  }, [options]);

  const selectHandler = (e: any) => {
    append({ hond_id: e.value, naam: e.label, avatar: e.avatar });
    setSelectedHonden(() => [
      ...selectedHonden,
      { id: e.value, naam: e.label },
    ]);
    setAvailable(
      [...options].filter(({ value }) => {
        const selectedIds = [...selectedHonden.map((hond) => hond.id), e.value];
        return !selectedIds.includes(value);
      })
    );
  };

  const removeHandler = (index: number, id: number) => {
    const selection = [...selectedHonden].filter((hond) => hond.id != id);
    setSelectedHonden(() => selection);
    setAvailable(
      [...options].filter(({ value }) => {
        const selectedIds = [...selection].map((hond) => hond.id);
        return !selectedIds.includes(value);
      })
    );
    remove(index);
  };

  return (
    <>
      {klantId ? (
        <>
          <div className="mb-20">
            <Select
              options={available}
              onChange={selectHandler}
              value={{
                label: `${
                  available.length > 0
                    ? "Voeg een hond toe"
                    : "geen honden meer"
                }`,
                value: undefined,
              }}
            />
            {fields.map((el: any, index: number) => (
              <Hond
                key={el.id}
                naam={values().details[index].naam}
                index={index}
                control={control}
                remove={removeHandler}
                id={values().details[index].hond_id}
                avatar={values().details[index].avatar}
                errors={errors}
                setErrors={setErrors}
                boeking={true}
              />
            ))}
          </div>
          <FormRow className="mt-20">
            <Button
              type="form"
              label="volgende"
              onClick={() => setActiveTab(2)}
            />
          </FormRow>
        </>
      ) : (
        <Title1>
          Klik <Link to={LOGIN}>hier</Link> om in te loggen.
        </Title1>
      )}
    </>
  );
};

export default Step1;
