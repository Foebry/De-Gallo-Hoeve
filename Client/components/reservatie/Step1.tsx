import React, { useEffect, useState } from "react";
import {
  FieldValues,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from "react-hook-form";
import Button from "../buttons/Button";
import Select, { OptionsOrGroups } from "react-select";
import { FormStepProps } from "../form/FormTabs";
import Hond from "../Hond";

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
  honden: any;
  options: any;
  values: any;
}

const Step1: React.FC<Props> = ({
  control,
  setActiveTab,
  fields,
  append,
  remove,
  honden,
  options,
  values,
}) => {
  const [available, setAvailable] =
    useState<OptionsOrGroups<any, OptionInterface>>(options);
  const [selectedHonden, setSelectedHonden] = useState<SelectionInterface[]>(
    []
  );
  useEffect(() => {
    console.log(values());
  }, [values]);

  const selectHandler = (e: any) => {
    append({ hond_id: e.value, naam: e.label });
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
  useEffect(() => {
    console.log("values", values());
  }, []);

  return (
    <>
      <div className="mb-20">
        <Select
          options={available}
          onChange={selectHandler}
          value={{
            label: `${
              available.length > 0 ? "Voeg een hond toe" : "geen honden meer"
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
          />
        ))}
      </div>
      <Button type="form" label="volgende" onClick={() => setActiveTab(2)} />
    </>
  );
};

export default Step1;
