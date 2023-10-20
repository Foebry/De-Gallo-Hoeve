import { nanoid } from 'nanoid';
import { createContext, useContext, useState } from 'react';
import { AvailabilityDto, SubscriptionDetailsDto, SubscriptionDto } from 'src/common/api/dtos/Subscription';
import { SubscriptionDetails } from 'src/common/domain/entities/Subscription';
import { IsKlantCollection } from 'src/common/domain/klant';
import { SelectedRange } from 'src/components/form/inputs/date/DateRangeSelector';
import useMutation from 'src/hooks/useMutation';
import { getDatesBetween, notEmpty, unique } from 'src/shared/functions';

type DogsForDate = {
  date: string;
  weekday: string;
  dogs: { label: string; value: string }[];
};
type SelectedMoments = {
  date: string;
  weekday: string;
  moments: { label: string; value: string }[];
};

export type FormType = {
  recurring: boolean;
  period: SelectedRange;
  weekDays: string[];
  dates: string[];
  moments: SelectedMoments[];
  dogs: DogsForDate[];
};

type ItemMapper = (
  item: SubscriptionDetailsDto,
  idx: number,
  arr: SubscriptionDetailsDto[]
) => SubscriptionDetailsDto | null;

type Context = {
  subscriptionCheck: AvailabilityDto | null;
  checkAvailableSubscriptions: (payload: SubscriptionDto) => Promise<AvailabilityDto | null>;
  mapToSubscriptionDto: (values: FormType, klant: IsKlantCollection) => SubscriptionDto;
  mapAvailabilityDtoToSubscriptionDto: (itemMapper: ItemMapper) => SubscriptionDto;
};

const Context = createContext<Context | null>(null);

const SubscriptionProvider: React.FC<{ children: any }> = ({ children }) => {
  const mutate = useMutation<AvailabilityDto>('/api/subscriptions/check-availability');
  // state
  const [currentSubscriptionAvailableCheck, setCurrentSubscriptionAvailableCheck] = useState<AvailabilityDto | null>(
    null
  );

  // getters
  const subscriptionCheck: AvailabilityDto | null = currentSubscriptionAvailableCheck;

  // functions
  const checkAvailableSubscriptions = async (payload: SubscriptionDto): Promise<AvailabilityDto | null> => {
    const { data } = await mutate('', payload);
    setCurrentSubscriptionAvailableCheck(data ?? null);
    return data ?? null;
  };

  // helpers
  const mapToSubscriptionDto = (values: FormType, klant: IsKlantCollection): SubscriptionDto => {
    const period = values.period;
    const datesInPeriod = getDatesBetween(new Date(period.from), new Date(period.to));
    const selectedWeekdays = values.weekDays.map((weekday) => parseInt(weekday));
    const selectedDates = datesInPeriod.filter((date) => selectedWeekdays.includes(date.getDay()));

    const allSubscriptionItems = selectedDates
      .map((date) => {
        const id = nanoid();
        const weekday = date.getDay().toString();
        const datum = date.toISOString().split('T')[0];
        if (!weekday) return;
        const hondIds = values.dogs
          .filter((dogValues) => dogValues.weekday === weekday)
          .reduce((acc, dogValues) => [...acc, ...dogValues.dogs.map((dogOption) => dogOption.value)], [] as string[]);
        const timeSlots = values.moments
          .filter((momentValues) => momentValues.weekday === weekday)
          .reduce(
            (acc, momentValues) => [...acc, ...momentValues.moments.map((moment) => moment.value)],
            [] as string[]
          );

        return {
          datum,
          hondIds: unique(hondIds),
          timeSlots,
          id,
        };
      })
      .filter(notEmpty);

    const result: SubscriptionDto = {
      klantId: klant?._id.toString() ?? '',
      serviceId: '64e508a34a1ed9fa7ad6fe09',
      items: allSubscriptionItems,
    };
    return result;
  };
  const mapAvailabilityDtoToSubscriptionDto = (itemMapper: ItemMapper): SubscriptionDto => {
    return {
      klantId: currentSubscriptionAvailableCheck?.available?.klantId ?? '',
      serviceId: currentSubscriptionAvailableCheck?.available?.serviceId ?? '',
      items: (currentSubscriptionAvailableCheck?.available?.items || [])
        .map((item, idx, arr) => itemMapper(item, idx, arr))
        .filter(notEmpty),
    };
  };

  return (
    <Context.Provider
      value={{
        subscriptionCheck,
        checkAvailableSubscriptions,
        mapToSubscriptionDto,
        mapAvailabilityDtoToSubscriptionDto,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default SubscriptionProvider;

export const useSubscriptionContext = () => {
  const context = useContext(Context);
  if (!context) throw Error('No access to SubscriptionContext');
  return context;
};
