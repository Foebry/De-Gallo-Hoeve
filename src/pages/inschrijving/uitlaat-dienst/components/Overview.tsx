import React, { useMemo, useState } from 'react';
import Spinner from 'src/components/loaders/Spinner';
import Table, { TableRow } from 'src/components/Table/Table';
import { useUserContext } from 'src/context/app/UserContext';
import { AvailabilityDto, SubscriptionDetailsDto, SubscriptionDto } from 'src/common/api/dtos/Subscription';
import Select, { MultiValue } from 'react-select';
import TimeFrameSelect from './timeFrameSelect';
import { useSubscriptionContext } from 'src/context/app/SubscriptionContext';
import { classNames, getDayNameFromDate, notEmpty } from 'src/shared/functions';
import { Body } from 'src/components/Typography/Typography';
import { Pagination } from 'src/common/api/shared/types';
import { ImCross } from 'react-icons/im';
import { SubmitButton } from 'src/components/buttons/Button';
import FormRow from 'src/components/form/FormRow';
import TableSummary from './TableSummary';

export type MultiSelectValue = MultiValue<{ value: string; label: string }>;

type Props = { onSubmit: (values: SubscriptionDto | undefined) => Promise<void>; ['r-if']: boolean };

const Step3: React.FC<Props> = ({ onSubmit, ['r-if']: rIf }) => {
  const pageSize = 10;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const { subscriptionCheck, checkAvailableSubscriptions, mapAvailabilityDtoToSubscriptionDto } =
    useSubscriptionContext();
  const { honden, klant } = useUserContext();

  const hondOptions = honden.map((hond) => ({
    label: hond.naam,
    value: hond.id,
  }));

  const onDogChange = async (value: MultiSelectValue, id: string) => {
    if (!subscriptionCheck) return;
    setIsLoading(true);
    const itemMapper = (item: SubscriptionDetailsDto) => {
      return item.id === id ? { ...item, hondIds: value.map((hond) => hond.value) } : item;
    };
    const payload: SubscriptionDto = mapAvailabilityDtoToSubscriptionDto(itemMapper);
    await checkAvailableSubscriptions(payload);
    setIsLoading(false);
  };

  const onTimeFrameChange = async (value: MultiSelectValue, id: string) => {
    if (!subscriptionCheck) return;
    setIsLoading(true);
    const itemMapper = (item: SubscriptionDetailsDto) => {
      return item.id === id ? { ...item, timeSlots: value.map((timeSlot) => timeSlot.value) } : item;
    };
    const payload = mapAvailabilityDtoToSubscriptionDto(itemMapper);
    await checkAvailableSubscriptions(payload);
    setIsLoading(false);
  };

  const onRemoveItem = async (id: string) => {
    setIsLoading(true);
    const itemMapper = (item: SubscriptionDetailsDto) => {
      return item.id !== id ? item : null;
    };
    const payload = mapAvailabilityDtoToSubscriptionDto(itemMapper);
    await checkAvailableSubscriptions(payload);
    setIsLoading(false);
  };

  const getSelectedDogs = (item: SubscriptionDetailsDto) => {
    return item.hondIds
      ?.map((hondId) => {
        const hond = honden.find((h) => h.id === hondId);
        if (hond) return { label: hond.naam, value: hond.id };
      })
      .filter(notEmpty);
  };

  const createTableRowsFromData = (data: AvailabilityDto | null): [TableRow[], number, Pagination] => {
    if (!data) return [[], 0, { first: 0, last: 0, page: 1, total: 0 }];
    const rows = (data.available?.items.slice((page - 1) * pageSize, page * pageSize) ?? []).map((item) => {
      const id = item.id;
      const priceExcl = data.priceExcl;
      const date = new Date(item.datum).toLocaleDateString('nl-BE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      const day = getDayNameFromDate(new Date(item.datum));
      const dogs = (
        <Select
          className="w-full table-select"
          isMulti={true}
          options={hondOptions}
          onChange={(e) => onDogChange(e, id)}
          value={getSelectedDogs(item)}
        />
      );
      const timeFrames = (
        <TimeFrameSelect
          isMulti={true}
          value={item.timeSlots.map((timeSlot) => ({ label: timeSlot, value: timeSlot }))}
          onChange={(e) => onTimeFrameChange(e, id)}
        />
      );
      const dogsAmount = item.hondIds.length;
      const timeSlotsAmount = item.timeSlots.length;
      const unitPrice = timeSlotsAmount === 1 ? priceExcl : timeSlotsAmount === 2 ? 22.5 : 35;
      const rowTotalExcl = (dogsAmount * unitPrice).toFixed(2);
      const crossIcon = (
        <ImCross style={{ color: 'red' }} className="cursor-pointer" onClick={() => onRemoveItem(id)} />
      );

      return {
        rowId: id,
        rowData: [`${day} ${date}`, dogs, timeFrames, `€ ${unitPrice}`, dogsAmount, `€ ${rowTotalExcl}`, crossIcon],
      };
    });

    const totalItems = data.available?.items?.length ?? 0;

    const pagination: Pagination = {
      page: page,
      first: (page - 1) * pageSize + 1,
      last: Math.min(page * pageSize, totalItems),
      total: totalItems,
      next: page < Math.ceil(totalItems / pageSize) ? page + 1 : undefined,
      prev: page > 1 ? page - 1 : undefined,
    };

    return [rows, totalItems, pagination];
  };

  const [rows, totalRows, pagination] = useMemo(
    () => createTableRowsFromData(subscriptionCheck),
    [subscriptionCheck, page]
  );

  const columns = ['datum', 'honden', 'momenten', 'prijs Excl', 'aantal', 'totaalExcl', ''];
  const colWidths = ['15', '27.5', '25', '10.25', '7.5', '7.5', '5'];

  const total = useMemo(() => {
    if (!subscriptionCheck) return 0;
    const priceExcl = subscriptionCheck.priceExcl;
    const travelCost = subscriptionCheck.travelCost;
    const rows = subscriptionCheck.available?.items?.map((item) => ({
      dogAmount: item.hondIds.length,
      periodAmount: item.timeSlots.length,
      rowTotal: (item.timeSlots.length === 3 ? 35 : item.timeSlots.length === 2 ? 22.5 : 15) * item.hondIds.length,
    }));
    const totalTravelCost = rows?.reduce((acc, curr) => acc + curr.periodAmount * travelCost, 0) ?? 0;
    const totalCost = rows?.reduce((acc, curr) => acc + curr.rowTotal, 0) ?? 0;
    return (totalCost * 1.21 + totalTravelCost).toFixed(2);
  }, [subscriptionCheck]);

  const onPageClick = async (page: number | undefined) => {
    if (!page) return;
    setPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return rIf ? (
    <>
      <Spinner r-if={isLoading} label="Beschibaarheid controleren" />
      {!isLoading && !subscriptionCheck && (
        <div>
          <Body>Er is iets fout gegaan, keer terug naar de vorige stap</Body>
        </div>
      )}
      {!isLoading && subscriptionCheck && !subscriptionCheck.available && (
        <div>
          <Body>
            Al uw geselecteerde momenten zijn reeds bezet, Keer terug naar de vorige stap om een andere selectie te
            maken
          </Body>
        </div>
      )}
      {!isLoading && subscriptionCheck && subscriptionCheck.available && (
        <div className="w-full">
          <div className="mb-4 px-10">
            <Body className="text-left">
              De selectie die u maakte omvat <strong>{totalRows}</strong> dagen. De verschillende dagen kunt u in
              onderstaande tabel raadplegen. <br />
              Indien u voor een specifieke dag een andere selectie wil hanteren, kunt u nog steeds uw gewenste hond(en)
              en/of momenten aanpassen. <br />
              Wenst u een specifieke dag te verwijderen, klikt u op de{' '}
              <ImCross style={{ color: 'red' }} className="inline-block" />.
            </Body>
            <Body className="text-left">
              Onder de tabel vindt u een overzicht van de <strong>totale kosten</strong>.
            </Body>
          </div>
          <Table
            rows={rows}
            columns={columns}
            colWidths={colWidths}
            onPaginationClick={onPageClick}
            pagination={pagination}
          />
          <TableSummary subscriptionCheck={subscriptionCheck} className="flex flex-row-reverse my-20" />

          <FormRow className="flex flex-row-reverse">
            <SubmitButton label="Naar betalen" onClick={() => onSubmit(subscriptionCheck?.available)} />
          </FormRow>
        </div>
      )}
    </>
  ) : (
    <></>
  );
};

export default Step3;
