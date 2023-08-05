import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { RangePicker } from 'react-trip-date';
import FormInput from '../../FormInput';
import FormRow from '../../FormRow';

export type SelectedRange = {
  from: string;
  to: string;
};

type Props = {
  onChange: (...event: any[]) => void;
  value: SelectedRange;
  // retrieveStartDate?: Dispatch<SetStateAction<string | undefined>>;
  retrieveStartDate?: (value: string) => void;
};

const DateRangeSelector: React.FC<Props> = ({ onChange, value, retrieveStartDate }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(
    value ? Object.entries(value).join(' - ') : ''
  );

  const openRangePickerModal = () => setIsModalOpen(true);

  useEffect(() => {
    const entries = value ? Object.entries(value) : [];
    const from = entries.find(([key]) => key === 'from')?.[1];
    const to = entries.find(([key]) => key === 'to')?.[1];
    setInputValue(from && to ? `Vanaf: ${from}     tot: ${to}` : '');
    if (from && to) setIsModalOpen(false);
  }, [value]);

  useEffect(() => {
    if (isModalOpen) return;
    retrieveStartDate?.(value?.from);
  }, [isModalOpen, retrieveStartDate]);

  return (
    <>
      <FormRow>
        <FormInput
          label="startDatum"
          name="periode"
          id="duration"
          onFocus={openRangePickerModal}
          value={value?.from}
          onChange={() => {}}
        />
        <FormInput
          label="eindDatum"
          name="periode"
          id="duration"
          onFocus={openRangePickerModal}
          value={value?.to}
          onChange={() => {}}
        />
      </FormRow>
      {isModalOpen && (
        <RangePicker onChange={onChange} selectedDays={value} numberOfMonths={2} />
      )}
    </>
  );
};

export default DateRangeSelector;
