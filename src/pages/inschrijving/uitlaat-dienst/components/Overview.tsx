import React, { useEffect, useMemo, useState } from 'react';
import { UseFormGetValues } from 'react-hook-form';
import { IsKlantCollection } from 'src/common/domain/klant';
import Spinner from 'src/components/loaders/Spinner';
import Table from 'src/components/Table/Table';
import { useInschrijvingContext } from 'src/context/app/InschrijvingContext';
import { useUserContext } from 'src/context/app/UserContext';
import { CheckAvailabilityType } from 'src/pages/api/subscriptions/schemas';
import { FormType } from '../index.page';
import { AvailabilityDto, SubscriptionDto } from 'src/common/api/dtos/Subscription';
import Select, { MultiValue } from 'react-select';
import TimeFrameSelect from './timeFrameSelect';
import { getDatesBetween, notEmpty } from 'src/shared/functions';
import { unique } from 'src/common/api/shared/functions';

type Props = {
  getValues: UseFormGetValues<FormType>;
};

export type MultiSelectValue = MultiValue<{ value: string; label: string }>;

const Step3: React.FC<Props> = ({ getValues }) => {
  const values = getValues();
  const { honden } = useUserContext();

  const hondOptions = honden.map((hond) => ({
    label: hond.naam,
    value: hond.id,
  }));

  const onDogChange = (value: any, args: any) => {
    console.log({ value, args });
  };

  const handleTimeFrameSelect = (e: MultiSelectValue, idx: number) => {
    console.log({ e, idx });
  };

  const createTableRowsFromData = (data: AvailabilityDto | null) => {
    return (
      data?.available?.items?.map((item, idx) => {
        const priceExcl = data.priceExcl;
        const date = new Date(item.date).toLocaleDateString('nl-BE', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
        const dogs = (
          <Select
            className="w-full table-select"
            isMulti={true}
            options={hondOptions}
            onChange={(e) => onDogChange(e, idx)}
            value={item.dogs.map((dog) => ({ value: dog._id.toString(), label: dog.naam }))}
          />
        );
        const timeFrames = (
          <TimeFrameSelect
            isMulti={true}
            value={item.timeSlots.map((timeSlot) => ({ label: timeSlot, value: timeSlot }))}
            onChange={(e) => handleTimeFrameSelect(e, idx)}
          />
        );
        const dogsAmount = item.dogs.length;
        const timeSlotsAmount = item.timeSlots.length;
        const unitPrice = timeSlotsAmount === 1 ? priceExcl : timeSlotsAmount === 2 ? 22.5 : 35;
        const rowTotalExcl = (dogsAmount * unitPrice).toFixed(2);

        return [date, dogs, timeFrames, unitPrice, dogsAmount, rowTotalExcl];
      }) ?? []
    );
  };

  const { useCheckAvailabilityRecurringWalkingServiceSubscriptions } = useInschrijvingContext();
  const { klant } = useUserContext();
  const payload = transformValues(values, klant!);
  const { data: result, isLoading, error } = useCheckAvailabilityRecurringWalkingServiceSubscriptions(payload);
  const [data, setData] = useState<AvailabilityDto | null>(result);
  const rows = useMemo(() => createTableRowsFromData(data), [data]);
  const columns = ['datum', 'honden', 'momenten', 'eenheidsprijs', 'aantal', 'totaalExcl'];
  const colWidths = ['15', '30', '25', '12.5', '7.5', '10'];
  const total = useMemo(() => {
    if (!result) return 0;
    const priceExcl = result?.priceExcl;
    const travelCost = result?.travelCost;
    const rows = result?.available?.items?.map((item) => ({
      dogAmount: item.dogs.length,
      periodAmount: item.timeSlots.length,
      rowTotal: (item.timeSlots.length === 3 ? 35 : item.timeSlots.length === 2 ? 22.5 : 15) * item.dogs.length,
    }));
    const totalTravelCost = rows?.reduce((acc, curr) => acc + curr.periodAmount * travelCost, 0) ?? 0;
    const totalCost = rows?.reduce((acc, curr) => acc + curr.rowTotal, 0) ?? 0;
    return (totalCost * 1.21 + totalTravelCost).toFixed(2);
  }, [result]);

  const onPageClick = async (page?: number) => {};

  useEffect(() => {
    if (result) setData(result);
  }, [result]);

  return (
    <>
      {isLoading && (
        <div>
          <p>Beschikbaarheid controleren</p>
          <Spinner />
        </div>
      )}
      {!isLoading && result && result.available && (
        <div className="w-full">
          <Table rows={rows} columns={columns} colWidths={colWidths} onPaginationClick={onPageClick} />

          <div>
            <p>
              Totaal: <span>{total}</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

const transformValues = (values: FormType, klant: IsKlantCollection): SubscriptionDto => {
  const period = values.period;
  const datesInPeriod = getDatesBetween(new Date(period.from), new Date(period.to));
  const selectedWeekdays = values.weekDays.map((weekday) => parseInt(weekday));
  const selectedDates = datesInPeriod.filter((date) => selectedWeekdays.includes(date.getDay()));

  const allSubscriptionItems = selectedDates
    .map((date) => {
      const weekday = date.getDay().toString();
      const datum = date.toISOString().split('T')[0];
      if (!weekday) return;
      const hondIds = values.dogs
        .filter((dogValues) => dogValues.weekday === weekday)
        .reduce((acc, dogValues) => [...acc, ...dogValues.dogs.map((dogOption) => dogOption.value)], [] as string[]);
      const timeSlots = values.moments
        .filter((momentValues) => momentValues.weekday === weekday)
        .reduce((acc, momentValues) => [...acc, ...momentValues.moments.map((moment) => moment.value)], [] as string[]);

      return {
        datum,
        hondIds: unique(hondIds),
        timeSlots,
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

export default Step3;
