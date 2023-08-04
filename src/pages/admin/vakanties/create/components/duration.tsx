import { Body, Title3 } from 'src/components/Typography/Typography';
import { MyRangePicker } from 'src/components/MyRangePicker';
import { RangePickerSelectedDays } from 'react-trip-date/dist/rangePicker/rangePicker.type';
import { VacationDto } from '@/types/DtoTypes/VacationDto';
import { Control, Controller, UseFormRegister } from 'react-hook-form';
import { RangePicker } from 'react-trip-date';
import { FormType } from '../index.page';

type Props = {
  control: Control<FormType, any>;
};

const VacationDuration: React.FC<Props> = ({ control }) => {
  // const onChange = (e: RangePickerSelectedDays) => {
  //   console.log(e);
  // };
  return (
    <>
      <div className="mx-auto text-center">
        <Title3 className="text-green-200">
          De geslecteerde periode wordt aangeduidt met een groene kader
        </Title3>
        <Body>
          Om en periode aan te duiden, klik op de startDatum, vervolgens klik je op de
          einddatum van de vakantie periode.
        </Body>
        <Body>
          Indien de begin -of einddatum buiten de getoonde maanden ligt, navigeer je eerst
          naar de juist maand
        </Body>
        <div className="mt-20 w-1/2 mx-auto">
          <Controller
            name="duration"
            control={control}
            render={({ field: { value, onChange } }) => (
              <RangePicker
                onChange={onChange}
                autoResponsive={true}
                startOfWeek={1}
                selectedDays={value}
                locale={'de'}
              />
            )}
          />
        </div>
      </div>
    </>
  );
};

export default VacationDuration;
