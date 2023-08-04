import { StringifyOptions } from 'querystring';
import { useEffect, useState } from 'react';
import { RangePicker } from 'react-trip-date';
import { RangePickerSelectedDays } from 'react-trip-date/dist/rangePicker/rangePicker.type';
import { FormError } from './Typography/Typography';

interface Props {
  onChange: (e: RangePickerSelectedDays) => void;
}

export const MyRangePicker: React.FC<Props> = ({ onChange }) => {
  const [ready, setReady] = useState<boolean>(false);
  const navigator = 'a';
  return (
    <>
      <RangePicker onChange={onChange} numberOfMonths={2} startOfWeek={1} />
      {/* <FormError>{errors[name]}</FormError> */}
    </>
  );
};
