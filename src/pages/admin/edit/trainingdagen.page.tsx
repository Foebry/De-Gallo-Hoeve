import React, { useEffect, useState } from 'react';
import Dashboard from 'src/components/admin/dashboard';
import { Body, Title2, Title3 } from 'src/components/Typography/Typography';
import { DatePicker } from 'react-trip-date';
import { TrainingDayDto } from '@/types/DtoTypes/TrainingDto';
import NavLink from 'src/components/NavLink';
import { useTrainingDayContext } from 'src/context/app/TrainingDayContext';

interface Props {}

const Trainingdagen: React.FC<Props> = ({}) => {
  const { updateAvailableDays } = useTrainingDayContext();

  const selectedDays = useGetAvailableTrainingDays();
  const onChange = (data: string[]) => {
    updateAvailableDays(data);
  };

  return (
    <Dashboard>
      <div className="flex flex-row-reverse mt-10 mr-10">
        <NavLink href="/admin/edit/trainingtijden" label="volgende" />
      </div>
      <div className="max-w-7xl mx-auto text-center text-green-200">
        <Title2>Pas hier de beschikbare dagen aan</Title2>
        <Title3>Beschikbare data staan aangeduidt in een groene bol.</Title3>
        <Body>
          Om een dag als beschikbaar aan te duiden, klik op de bepaalde dag om deze te
          selecteren.
        </Body>
        <Body>Alle niet geslecteerde dagen zullen niet beschikbaar zijn</Body>
      </div>
      <div className="max-w-3xl mx-auto mt-10">
        <DatePicker
          onChange={onChange}
          selectedDays={selectedDays}
          disabledBeforeToday={true}
          startOfWeek={1}
        />
      </div>
    </Dashboard>
  );
};

const useGetAvailableTrainingDays = () => {
  const [trainingDays, setTrainingDays] = useState<TrainingDayDto[]>([]);
  const { getTrainingDays } = useTrainingDayContext();
  useEffect(() => {
    (async () => {
      const trainingDays = await getTrainingDays();
      if (trainingDays) setTrainingDays(trainingDays);
    })();
  }, [getTrainingDays]);

  return trainingDays.map((day) => day.date.split('T')[0]);
};

export default Trainingdagen;
