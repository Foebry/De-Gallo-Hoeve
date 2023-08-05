import { ReactNode, useState } from 'react';
import { DatePicker } from 'react-trip-date';
import FormInput from '../../FormInput';

type Props = {
  onChange: (...event: any[]) => void;
  value: string;
  label: string;
  name: string;
  id: string;
  defaultValue?: string;
};

const DateSelector: React.FC<Props> = ({
  onChange,
  value,
  label,
  name,
  id,
  defaultValue,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const openDatePickerModal = () => setIsModalOpen(true);
  console.log({ defaultValue, value });
  return (
    <>
      <FormInput
        label={label}
        name={name}
        id={id}
        value={value ? value : defaultValue || ''}
        onChange={() => {}}
        onFocus={openDatePickerModal}
      />
      {isModalOpen && (
        <DatePicker
          onChange={onChange}
          numberOfSelectableDays={1}
          selectedDays={[value ? value?.[0] : defaultValue || '']}
        />
      )}
    </>
  );
};

export default DateSelector;
