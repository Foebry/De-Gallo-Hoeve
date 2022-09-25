import Select, { OptionsOrGroups } from "react-select";
import { optionInterface } from "./register/HondGegevens";
import { FormError } from "./Typography/Typography";

interface Props {
  options: any;
  onChange: any;
  errors: any;
  name: string;
  value: any;
}

export const MySelect: React.FC<Props> = ({
  options,
  onChange,
  value,
  errors,
  name,
}) => {
  return (
    <>
      <Select
        options={options}
        onChange={onChange}
        value={value ?? { label: "Ras", value: undefined }}
      />
      <FormError>{errors[name]}</FormError>
    </>
  );
};
