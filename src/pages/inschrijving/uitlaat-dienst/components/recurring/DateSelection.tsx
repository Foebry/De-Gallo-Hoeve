import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import DateRangeSelector, { SelectedRange } from 'src/components/form/inputs/date/DateRangeSelector';
import { Body } from 'src/components/Typography/Typography';
import { classNames, getCurrentTime, getDatesBetween, unique } from 'src/shared/functions';
import { FormType, HandleSelectWeekDayArgs } from '../../index.page';

type Props = {
  control: Control<FormType, any>;
  selectedPeriod: SelectedRange;
  handleSelectWeekdays: (...args: HandleSelectWeekDayArgs) => void;
};

type RangeChangeArgs = [e: { from?: string; to?: string }, onChange: (...event: any[]) => void];

const DateSelection: React.FC<Props> = ({ control, selectedPeriod, handleSelectWeekdays }) => {
  const [selectedRange, setSelectedRange] = useState<SelectedRange>(selectedPeriod);
  const today = getCurrentTime().toISOString().split('T')[0];
  const rangeSelected = !!selectedRange;

  const handleRangeSelectionChange = (...args: RangeChangeArgs) => {
    const [{ from, to }, onChange] = args;
    onChange({ from, to });
    if (from && to) setSelectedRange({ from, to });
  };

  const getSelectedWeekdayOptions = () => {
    const { from, to } = selectedRange;
    const allDaysInSelection: Date[] = getDatesBetween(new Date(from), new Date(to));

    const weekdaysInSelection: number[] = unique(allDaysInSelection.map((date) => date.getDay()));

    const weekdays = [
      { title: 'Maandag', id: '1' },
      { title: 'Dinsdag', id: '2' },
      { title: 'Woensdag', id: '3' },
      { title: 'Donderdag', id: '4' },
      { title: 'Vrijdag', id: '5' },
      { title: 'Zaterdag', id: '6' },
      { title: 'Zondag', id: '0' },
    ];
    return weekdays.filter((day) => weekdaysInSelection.includes(parseInt(day.id)));
  };

  return (
    <>
      <div className="w-2/3 mx-auto">
        <div className="mb-16">
          <Body>
            Selecteer een gewenste periode, vervolgens selecteert u uw gewenst wekelijkse dagen. <br />U kan ons dan
            iedere week, binnen de gewenst periode, verwachten op de aangeduide dagen.
          </Body>
        </div>

        <Controller
          control={control}
          name="period"
          render={({ field: { value, onChange } }) => (
            <>
              <p className="mb-12 text-xl text-grey-100 font-semibold">Selecteer uw gewenste periode.</p>
              <DateRangeSelector
                disabledBeforeToday={true}
                disabledDays={[today]}
                value={value}
                onChange={(e) => handleRangeSelectionChange(e, onChange)}
                disabled={false}
                closeOnSelection={true}
              />
            </>
          )}
        />
      </div>
      {rangeSelected && (
        <div>
          <p className="mb-12 text-xl text-grey-100 font-semibold">Selecteer de gewenste weekdagen</p>
          <div className="flex justify-center gap-3 flex-wrap lg:flex-nowrap">
            <Controller
              control={control}
              name="weekDays"
              render={({ field: { value, onChange } }) => (
                <>
                  {getSelectedWeekdayOptions().map((weekday) => (
                    <div
                      key={weekday.id}
                      data-id={weekday.id}
                      className="p-3 rounded min-w-3xs cursor-pointer"
                      onClick={(e) => handleSelectWeekdays(e, value ?? [], onChange)}
                    >
                      <div
                        className={`${classNames({
                          'bg-green-200 text-white-900': value?.includes(weekday.id),
                          'bg-grey-300 text-white-900': !value?.includes(weekday.id),
                        })} p-3 rounded-t pointer-events-none`}
                      >
                        {weekday.title}
                      </div>
                      <div className="p-3 rounded-b border-2 min-h-3xs">
                        {value?.includes(weekday.id) && (
                          <Image
                            src="https://res.cloudinary.com/dv7gjzlsa/image/upload/v1659613403/De-Gallo-Hoeve/content/logo-r_vwnpdy.png"
                            width={64}
                            height={64}
                            alt="degallohoeve logo"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DateSelection;
