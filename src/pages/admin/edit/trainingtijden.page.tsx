import { TrainingDayDto } from '@/types/DtoTypes/TrainingDto';
import { ADMINEDITTRAININGDAYS } from '@/types/linkTypes';
import React, { useContext, useMemo, useState } from 'react';
import { useEffect } from 'react';
import Dashboard from 'src/components/admin/dashboard';
import Button from 'src/components/buttons/Button';
import FormRow from 'src/components/form/FormRow';
import NavLink from 'src/components/NavLink';
import { Body, EbmeddedLink, Title2 } from 'src/components/Typography/Typography';
import { TrainingDayContext } from 'src/context/TrainingDayContext';
import TrainingDay from './components/TrainingDay';
import { TiDelete, TiRefresh } from 'react-icons/ti';

type Props = {};

const Trainingtijden: React.FC<Props> = () => {
  const trainingDagen = useGetTrainingDays();
  const [saveTrainingDays] = useSaveTrainingDays();

  return (
    <Dashboard>
      <FormRow>
        <NavLink href="/admin/edit/trainingdagen" label={'vorige'} />
        <Button label="save" onClick={saveTrainingDays} />
      </FormRow>
      <div className="flex flex-row-reverse mt-10 mr-10"></div>
      <div className="max-w-7xl mx-auto text-center text-green-200">
        <Title2>Pas hier de beschikbare tijden aan</Title2>
        <Body>
          Standaard zijn alle dagen beschikbaar vanaf 10:00 tot en met 17:00. <br />
          Klik op{' '}
          <span className="text-red-900 inline-block">
            <TiDelete />
          </span>{' '}
          om een tijdstip uit te zetten. <br />
          Klik op{' '}
          <span className="text-red-100 inline-block">
            <TiRefresh />
          </span>{' '}
          om de standaard uren weer aan te zetten.
        </Body>
        <Body>
          Eenmaal de gewenste aanpassingen gebeurd zijn, klik op save om de aanpassingen
          door te voeren.
        </Body>
      </div>
      <div className="flex gap-2 flex-wrap mt-20">{trainingDagen}</div>
    </Dashboard>
  );
};

const useGetTrainingDays = () => {
  const [trainingDagen, setTrainingDagen] = useState<TrainingDayDto[]>([]);
  const { getTrainingDays } = useContext(TrainingDayContext);

  useEffect(() => {
    (async () => {
      const data = await getTrainingDays();
      setTrainingDagen(data);
    })();
  }, [getTrainingDays]);

  const trainingDayCards = useMemo(() => {
    return trainingDagen.length === 0 ? (
      <Body>Geen beschikbare training dagen</Body>
    ) : (
      trainingDagen.map((dag) => (
        <TrainingDay
          key={dag._id}
          timeslots={dag.timeslots}
          date={dag.date}
          _id={dag._id}
        />
      ))
    );
  }, [trainingDagen]);
  return trainingDayCards;
};

const useSaveTrainingDays = () => {
  const { saveTrainingDays } = useContext(TrainingDayContext);
  const save = async () => await saveTrainingDays();
  return [save];
};

export default Trainingtijden;
