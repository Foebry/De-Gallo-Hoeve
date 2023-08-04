import { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { RangePicker } from 'react-trip-date';
import Button from 'src/components/buttons/Button';
import FormInput from 'src/components/form/FormInput';
import { FormTextBox } from 'src/components/form/FormTextBox';
import { Body, Title3 } from 'src/components/Typography/Typography';
import { FormType } from '../index.page';

type Props = {
  control: Control<FormType, any>;
};

const ExtraVacationInfo: React.FC<Props> = ({ control }) => {
  const [showDurationPicker, setShowDurationPicker] = useState<boolean>(false);
  return (
    <div className="mx-auto text-center max-w-2xl">
      <div className="mb-16">
        <Title3 className="text-green-200">
          Vul hier de nodige informatie in voor de notificatie.
        </Title3>
        <Body>
          Deze gegevens worden gebruikt op de notificatie (banner + popup) aan te maken
        </Body>
      </div>
      <div>
        <Controller
          name="notificationStartDate"
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => {
            return (
              <div className="mb-5">
                <FormInput
                  label="notificatie-startdatum"
                  name="notificationStartDate"
                  id="notificationStartDate"
                  value={value}
                  onChange={onChange}
                  type="date"
                />
              </div>
            );
          }}
        />
        <Controller
          name="longDescription"
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <FormTextBox
                label="uitgebruide notificatie"
                name="uitgebruide notificatie"
                id="longDescription"
                onChange={onChange}
                errors={{}}
                setErrors={() => {}}
                value={value}
                style={{}}
              />
            );
          }}
        />
        <Controller
          name="notificationDescription"
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <FormTextBox
                label="korte notificatie"
                name="shortDescription"
                id="shortDescription"
                onChange={onChange}
                errors={{}}
                setErrors={() => {}}
                value={value}
                style={{}}
              />
            );
          }}
        />
        <Controller
          name="duration"
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <div>
                <Button
                  label="click me"
                  onClick={() =>
                    setShowDurationPicker((showDurationPicker) => !showDurationPicker)
                  }
                />{' '}
                {showDurationPicker && (
                  <RangePicker onChange={onChange} numberOfMonths={3} />
                )}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default ExtraVacationInfo;
