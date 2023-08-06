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
};

const DateRangeSelector: React.FC<Props> = ({ onChange, value, retrieveStartDate }) => {
  const { updateModal, openModal, isModalActive } = useContext(ModalContext);

  const openRangePickerModal = () => {
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
        <RangePicker onChange={onChange} selectedDays={value} numberOfMonths={2} />
      </div>
    );
  }, [value, onChange]);

  return (
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
  );
};

export default DateRangeSelector;
