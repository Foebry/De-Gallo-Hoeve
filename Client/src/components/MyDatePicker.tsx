import DatePicker from "react-datepicker";
import { FormError } from "./Typography/Typography";

interface Props {
  onChange: (e: Date | null) => void;
  selected: any;
  dateFormat: string;
  errors: any;
  name: string;
}

export const MyDatePicker: React.FC<Props> = ({
  onChange,
  selected,
  dateFormat,
  errors,
  name,
}) => {
  return (
    <>
      <DatePicker
        onChange={onChange}
        selected={selected}
        dateFormat={dateFormat}
      />
      <FormError>{errors[name]}</FormError>
    </>
  );
};
