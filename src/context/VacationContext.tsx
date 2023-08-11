import { useRouter } from 'next/router';
import { createContext, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { CreateVacationDto, VacationDto } from 'src/common/api/dtos/VacationDto';
import { SelectedRange } from 'src/components/form/inputs/date/DateRangeSelector';
import getData from 'src/hooks/useApi';
import useMutation from 'src/hooks/useMutation';
import { PaginatedResponse } from 'src/shared/RequestHelper';
import { REQUEST_METHOD } from 'src/utils/axios';
import { string } from 'yup';
import { useBannerContext } from './BannerContext';

type VacationContext = {
  activateVacationNotification: (duration: SelectedRange) => void;
  getActiveVacation: () => Promise<VacationDto | undefined>;
  updateVacation: (dto: VacationDto) => Promise<void>;
  saveVacation: (dto: CreateVacationDto) => Promise<void>;
  disableVacationNotification: () => void;
  deleteVacation: (id: string) => Promise<void>;
  getVacationById: (id: string) => Promise<VacationDto | undefined>;
  getVacationList: () => Promise<PaginatedResponse<VacationDto> | undefined>;
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
  updateVacation: async () => {},
  saveVacation: async () => {},
  disableVacationNotification: () => {},
  deleteVacation: async () => {},
  getVacationById: async () => ({
    id: '',
    createdAt: '',
    updatedAt: '',
    duration: { from: '', to: '' },
    notificationStartDate: '',
  }),
  getVacationList: async () => ({
    pagination: { currentPage: 1, first: 1, last: 1, total: 1 },
    data: [],
  }),
};

export const VacationContext = createContext<VacationContext>(VacationContextDefaultValues);

const VacationProvider: React.FC<{ children: any }> = ({ children }) => {
  const router = useRouter();
  const { setBannerContent, activateBanner, disableBanner } = useBannerContext();
  const mutate = useMutation<VacationDto>('/api/admin/vacations/');

  const getActiveVacation = async () => {
    const { data, error } = await getData<VacationDto>('/api/announcements');
    if (error) toast.error(error.message);

    return data;
  };

  const updateVacation = async (dto: VacationDto) => {
    const { data, error } = await mutate(dto, {
      method: REQUEST_METHOD.PUT,
      params: { id: dto.id },
    });

    if (error) toast.error(error.message);
    if (data) {
      toast.success('Vakantie-periode aangepast');
      router.push('/admin/vakanties');
    }
  };

  const saveVacation = async (dto: CreateVacationDto) => {
    const { data, error } = await mutate(dto);
    if (error) {
      if (error.code === 403 && error.errorCode === 'NotLoggedInError') router.push('/login');
      else toast.error(error.message);
    }
    if (data) {
      toast.success('Vakantie-periode aangemaakt');
      disableBanner();
      router.push('/admin/vakanties');
    }
  };

  const deleteVacation = async (id: string) => {
    const { data, error } = await mutate({}, { method: REQUEST_METHOD.DELETE, params: { id } });
    if (data) toast.success('Vakantie-periode verwijderd');
    else if (error) toast.error(error.message);
    return;
  };

  const getVacationById = async (id: string) => {
    const { data, error } = await getData<VacationDto>(`/api/admin/vacations/${id}`);
    if (error) toast.error('Error bij ophalen vakantie data');
    if (data) return data;
  };

  const getVacationList = async () => {
    const { data, error } = await getData<PaginatedResponse<VacationDto>>(`/api/admin/vacations`);
    if (error) {
      if (error.errorCode === 'NotLoggedInError') router.push('/login');
      else toast.error(error.message);
    }
    return data;
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

  useEffect(() => {
    (async () => {
      const vacation = await getActiveVacation();
      if (vacation) activateVacationNotification(vacation.duration);
    })();
  }, []);

  return (
    <VacationContext.Provider
      value={{
        activateVacationNotification,
        getActiveVacation,
        updateVacation,
        saveVacation,
        disableVacationNotification,
        deleteVacation,
        getVacationById,
        getVacationList,
      }}
    >
      {children}
    </VacationContext.Provider>
  );
};

export default VacationProvider;

export const useVacationContext = () => useContext(VacationContext);
