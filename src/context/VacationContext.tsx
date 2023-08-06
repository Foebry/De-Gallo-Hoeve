import { useRouter } from 'next/router';
import { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { CreateVacationDto, VacationDto } from 'src/common/api/dtos/VacationDto';
import { SelectedRange } from 'src/components/form/inputs/date/DateRangeSelector';
import getData from 'src/hooks/useApi';
import useMutation from 'src/hooks/useMutation';
import { useBannerContext } from './BannerContext';

type VacationContext = {
  activateVacationNotification: (duration: SelectedRange) => void;
  getActiveVacation: () => Promise<VacationDto>;
  updateVacation: (dto: VacationDto) => void;
  saveVacation: (dto: CreateVacationDto) => Promise<void>;
  disableVacationNotification: () => void;
};

const VacationContextDefaultValues: VacationContext = {
  activateVacationNotification: () => {},
  getActiveVacation: async () => ({
    id: '',
    createdAt: '',
    updatedAt: '',
    duration: { from: '', to: '' },
    notificationStartDate: '',
  }),
  updateVacation: () => {},
  saveVacation: async () => {},
  disableVacationNotification: () => {},
};

export const VacationContext = createContext<VacationContext>(
  VacationContextDefaultValues
);

const VacationProvider: React.FC<{ children: any }> = ({ children }) => {
  const router = useRouter();
  const { setBannerContent, activateBanner, disableBanner } = useBannerContext();
  const mutate = useMutation();

  const getActiveVacation = async () => {
    const { data, error } = await getData('/api/vacations/active');
    if (error) toast.error(error);

    return data;
  };

  const updateVacation = async (dto: VacationDto) => {
    const { data, error } = await mutate(`/api/admin/vacations/${dto.id}`, dto, {
      method: 'PUT',
    });

    if (error) toast.error(error.message);
    if (data) toast.success('Vakantie-periode aangepast');
  };

  const saveVacation = async (dto: CreateVacationDto) => {
    const { data, error } = await mutate('/api/admin/vacations', dto);
    if (error) {
      if (error.code === 403 && error.errorCode === 'NotLoggedInError')
        router.push('/login');
      else toast.error(error.message);
    }
    if (data) {
      toast.success('Vakantie-periode aangemaakt');
      disableBanner();
      router.push('/admin/vakanties');
    }
  };

  const getResumeDate = (dateString: string) => {
    const date = new Date(dateString);
    const resumeDateNumber = date.setDate(date.getDate() + 1);
    return new Date(resumeDateNumber).toISOString();
  };

  const getBannerContent = (duration: SelectedRange) => {
    const startDate = getShortHandDate(duration.from);
    const endDate = getShortHandDate(duration.to);
    const resumeDate = getShortHandDate(getResumeDate(duration.to));
    return `Beste klant, wij gaan er even tussen uit vanaf ${startDate} tot en met ${endDate}.\nVanaf ${resumeDate} staan wij weer volledig paraat voor u en uw trouwe vriend`;
  };

  const activateVacationNotification = (duration: SelectedRange) => {
    if (!duration || !duration.from || !duration.to) {
      toast.warning('gelieve een geldige periode aan te geven');
      return;
    }

    setBannerContent(getBannerContent(duration));
    toast.info(getToastDescription(duration), {
      autoClose: false,
      closeOnClick: false,
    });
    activateBanner();
  };

  const disableVacationNotification = () => {
    disableBanner();
  };

  const getShortHandDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-BE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  const getToastDescription = (duration: SelectedRange) => {
    const endDate = getShortHandDate(duration.from);
    return `Beste klant, wij gaan er even tussen uit vanaf ${endDate}.`;
  };

  return (
    <VacationContext.Provider
      value={{
        activateVacationNotification,
        getActiveVacation,
        updateVacation,
        saveVacation,
        disableVacationNotification,
      }}
    >
      {children}
    </VacationContext.Provider>
  );
};

export default VacationProvider;

export const useVacationContext = () => useContext(VacationContext);