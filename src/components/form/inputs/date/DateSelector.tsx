import { useMemo } from 'react';
import { useContext } from 'react';
import { DatePicker } from 'react-trip-date';
import { ModalType } from 'src/components/Modal/Modal/BaseModal';
import { ModalContext } from 'src/context/ModalContext';
import FormInput from '../../FormInput';

type Props = {
  onChange: (...event: any[]) => void;
  value: string;
  label: string;
  name: string;
  id: string;
  defaultValue?: string;
  disabledAfterDate?: string;
};

const DateSelector: React.FC<Props> = ({
  onChange,
  value,
  label,
  name,
  id,
  defaultValue,
  disabledAfterDate,
}) => {
  const { updateModal, openModal } = useContext(ModalContext);
  const openDatePickerModal = () => {
    updateModal({ type: ModalType.DEFAULT, content: dateSelector });
    openModal();
  };

  const selectedDays = useMemo(() => {
    return value ? [value[0]] : defaultValue ? [defaultValue] : [];
  }, [value, defaultValue]);

  const dateSelector = useMemo(
    () => (
      <DatePicker
        onChange={onChange}
        numberOfSelectableDays={1}
        selectedDays={selectedDays}
        disabledAfterDate={disabledAfterDate}
      />
    ),
    [selectedDays, onChange]
  );
  return (
    <FormInput
      label={label}
      name={name}
      id={id}
      value={value ? value : defaultValue || ''}
      onChange={() => {}}
      onFocus={openDatePickerModal}
    />
  );
};

export default DateSelector;
