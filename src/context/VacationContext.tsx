import { nanoid } from 'nanoid';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { toast } from 'react-toastify';
import { SelectedRange } from 'src/components/form/inputs/date/DateRangeSelector';
import { useBannerContext } from './BannerContext';

type VacationContext = {
  activateVacationNotification: (duration: SelectedRange) => void;
};

const VacationContextDefaultValues: VacationContext = {
  activateVacationNotification: () => {},
};

export const VacationContext = createContext<VacationContext>(
  VacationContextDefaultValues
);

const VacationProvider: React.FC<{ children: any }> = ({ children }) => {
  const { setBannerContent } = useBannerContext();

  const getResumeDate = (dateString: string) => {
    const date = new Date(dateString);
    const resumeDateNumber = date.setDate(date.getDate() + 1);
    return new Date(resumeDateNumber).toISOString();
  };

  const getBannerContent = (duration: SelectedRange) => {
    const startDate = getShortHandDate(duration.from);
    const endDate = getShortHandDate(duration.to);
    const resumeDate = getShortHandDate(getResumeDate(duration.to));
    return `Beste klant, wij gaan er even tussen uit van ${startDate} tot en met ${endDate}.\nVanaf ${resumeDate} staan wij weer volledig paraat voor u en uw trouwe vriend`;
  };

  const activateVacationNotification = (duration: SelectedRange) => {
    if (!duration || !duration.from || !duration.to) {
      toast.warning('gelieve een geldige periode aan te geven');
      return;
    }

    setBannerContent(getBannerContent(duration));
    toast.info(getToastDescription(duration), {
      autoClose: false,
      closeButton: false,
      closeOnClick: false,
    });
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
      }}
    >
      {children}
    </VacationContext.Provider>
  );
};

export default VacationProvider;

export const useVacationContext = () => useContext(VacationContext);
