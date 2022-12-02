import { ReactNode } from "react";
import Select from "react-select";
import { FormError } from "./Typography/Typography";

interface Props {
  options: any;
  onChange: any;
  errors?: any;
  name: string;
  value: any;
  label?: ReactNode | string;
  disabled?: boolean;
}

export const MySelect: React.FC<Props> = ({
  options,
  onChange,
  value,
  errors = {},
  name,
  label,
  disabled = false,
}) => {
  return (
    <div className="relative mb-12">
      <span className="absolute -top-6 text-green-100 mr-5 capitalize w-full">
        {label}
      </span>
      <Select
        options={options}
        onChange={onChange}
        value={value ?? { label: "Ras", value: undefined }}
        isDisabled={disabled}
      />
      <FormError>{errors[name]}</FormError>
    </div>
  );
};
