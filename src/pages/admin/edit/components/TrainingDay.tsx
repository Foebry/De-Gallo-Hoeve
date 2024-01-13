import { TrainingDayDto } from '@/types/DtoTypes/TrainingDto';
import React from 'react';
import { Body, Title3, Title4 } from 'src/components/Typography/Typography';
import { defaultTrainingTimeSlots } from 'src/mappers/trainingDays';
import { TiDelete, TiRefresh } from 'react-icons/ti';
import { useTrainingDayContext } from 'src/context/app/TrainingDayContext';

type Props = {
  date: string;
  timeslots: string[];
  _id: string;
};

const TrainingDay: React.FC<Props> = ({ date, timeslots, _id }) => {
  const weekday = useGetWeekDay(date);
  const datum = useGetReadableDate(date);
  const [removeTimeSlot, resetTimeslots] = useUpdateTrainingDay({ date, timeslots, _id });

  return (
    <div className="border-green-200 rounded border-2 w-80 h-max min-h-26 relative">
      <div className="bg-green-200">
        <Title3 className="text-gray-100">
          {weekday}
          <br />
          {datum}
        </Title3>
      </div>
      <div>
        <Title4 className="text-green-400 relative">
          Beschikbare tijden:{' '}
          {timeslots.length < defaultTrainingTimeSlots.length && (
            <span
              aria-label="test"
              className="text-red-100 absolute right-10 top-1 cursor-pointer"
              onClick={resetTimeslots}
            >
              <TiRefresh />
            </span>
          )}
        </Title4>
        <ul className="py-4">
          {timeslots.map((timeslot) => (
            <div key={timeslot} className="flex px-10 justify-between">
              <Body>{timeslot}</Body>
              <span
                data-timeslot={timeslot}
                className="text-red-900 cursor-pointer"
                onClick={removeTimeSlot}
              >
                <TiDelete />
              </span>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

const useGetWeekDay = (dateOrString: string | Date): string => {
  let date = dateOrString;
  if (typeof date === 'string') date = new Date(date);

  const weekdays = {
    0: 'Zondag',
    1: 'Maandag',
    2: 'Dinsdag',
    3: 'Woensdag',
    4: 'Donderdag',
    5: 'Vrijdag',
    6: 'Zaterdag',
  };
  return weekdays[date.getDay() as keyof typeof weekdays];
};
const useGetReadableDate = (dateString: string): string =>
  dateString.split('T')[0].split('-').reverse().join('-');

const useUpdateTrainingDay = ({ timeslots, date, _id }: TrainingDayDto) => {
  const { updateTrainingDay } = useTrainingDayContext();
  const removeTimeSlot = (e: React.MouseEvent<HTMLSpanElement>) => {
    const timeslotToRemove = e.currentTarget.dataset.timeslot;
    const newTimeSlots = timeslots.filter((slot) => slot !== timeslotToRemove);
    const newTrainingDayDto: TrainingDayDto = {
      date,
      _id,
      timeslots: newTimeSlots,
    };
    updateTrainingDay(newTrainingDayDto);
  };
  const resetTimeSlots = (e: React.MouseEvent<HTMLSpanElement>) => {
    const newTrainingDayDto: TrainingDayDto = {
      date,
      _id,
      timeslots: defaultTrainingTimeSlots,
    };
    updateTrainingDay(newTrainingDayDto);
  };

  return [removeTimeSlot, resetTimeSlots];
};

export default TrainingDay;
