import React from 'react';
import { UseFormGetValues } from 'react-hook-form';
import { IsKlantCollection } from 'src/common/domain/klant';
import Spinner from 'src/components/loaders/Spinner';
import { useInschrijvingContext } from 'src/context/app/InschrijvingContext';
import { useKlantContext } from 'src/context/app/klantContext';
import { useUserContext } from 'src/context/app/UserContext';
import { CheckAvailabilityType } from 'src/pages/api/subscriptions/check-availability/schemas';
import { FormType } from '../index.page';

type Props = {
  getValues: UseFormGetValues<FormType>;
};

const Step3: React.FC<Props> = ({ getValues }) => {
  const values = getValues();

  const { useCheckAvailabilityRecurringWalkingServiceSubscriptions } = useInschrijvingContext();
  const { klant } = useUserContext();
  const payload = transformValues(values, klant!);
  const { data: result, isLoading, error } = useCheckAvailabilityRecurringWalkingServiceSubscriptions(payload);
  return (
    <>
      {isLoading && (
        <div>
          <p>Beschikbaarheid controleren</p>
          <Spinner />
        </div>
      )}
      {!isLoading && <div>Hallo!</div>}
    </>
  );
};

const transformValues = (values: FormType, klant: IsKlantCollection): CheckAvailabilityType => {
  const result: CheckAvailabilityType = {
    klantId: klant?._id.toString() ?? '',
    serviceId: '64e508a34a1ed9fa7ad6fe09',
    period: values.period,
    selectedDays: values.weekDays.map((weekday) => ({
      dogs: values.dogs
        .filter((d) => d.weekday === weekday)
        .map((d) => d.dogs)
        .reduce((acc, curr) => [...acc, ...curr], [])
        .map((d) => d.value),
      moments: values.moments
        .filter((m) => m.weekday === weekday)
        .map((m) => m.moments)
        .reduce((acc, curr) => [...acc, ...curr], [])
        .map((m) => m.value),
      weekday: weekday,
    })),
  };
  return result;
};

export default Step3;
