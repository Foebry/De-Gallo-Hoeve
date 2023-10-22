import { useMemo } from 'react';
import { useContext, useEffect } from 'react';
import { RangePicker } from 'react-trip-date';
import { ModalType } from 'src/components/Modal/Modal/BaseModal';
import { ModalContext } from 'src/context/ModalContext';
import FormInput from '../../FormInput';
import FormRow from '../../FormRow';

export type SelectedRange = {
  from: string;
  to: string;
};

type Props = {
  onChange: (...event: any[]) => void;
  value: SelectedRange;
  retrieveStartDate?: (value: string) => void;
  disabled?: boolean;
  disabledBeforeToday?: boolean;
  disabledDays?: string[];
  closeOnSelection?: boolean;
};

const DateRangeSelector: React.FC<Props> = ({
  onChange,
  value,
  retrieveStartDate,
  disabled = false,
  disabledDays = [],
  disabledBeforeToday = false,
  closeOnSelection = false,
}) => {
  const { updateModal, openModal, isModalActive, closeModal } = useContext(ModalContext);

  const openRangePickerModal = () => {
    if (disabled) return;
    updateModal({ type: ModalType.DEFAULT, content: rangeSelector });
    openModal();
  };

  useEffect(() => {
    if (isModalActive) return;
    retrieveStartDate?.(value?.from);
  }, [isModalActive, retrieveStartDate, value?.from]);

  const rangeSelector = useMemo(() => {
    return (
      <div className="min-w-s">
        <RangePicker
          onChange={(e) => {
            onChange(e);
            if (closeOnSelection && e.from && e.to) closeModal();
          }}
          selectedDays={value}
          numberOfMonths={2}
          disabledDays={disabledDays}
          disabledBeforeToday={disabledBeforeToday}
        />
      </div>
    );
  }, [value, onChange, disabledBeforeToday, disabledDays, closeOnSelection, closeModal]);

  return (
    <FormRow>
      <FormInput
        label="startDatum"
        name="periode"
        id="duration"
        onFocus={openRangePickerModal}
        value={value?.from.split('-').reverse().join('-')}
        onChange={() => {}}
      />
      <FormInput
        label="eindDatum"
        name="periode"
        id="duration"
        onFocus={openRangePickerModal}
        value={value?.to.split('-').reverse().join('-')}
        onChange={() => {}}
      />
    </FormRow>
  );
};

export default DateRangeSelector;
