import { PaginatedData } from 'src/common/api/shared/types';
import AuthContext from '../authContext';
import BannerProvider from '../BannerContext';
import VacationProvider from '../VacationContext';
import FeedbackProvider from './FeedbackContext';
import HondProvider from './hondContext';
import InschrijvingProvider from './InschrijvingContext';
import KlantProvider from './klantContext';
import { RasProvider } from './RasContext';
import SubscriptionProvider from './SubscriptionContext';
import TrainingProvider from './TrainingContext';
import TrainingDayProvider from './TrainingDayContext';
import UserProvider from './UserContext';

export const emptyPaginatedResponse = <T extends unknown>(): PaginatedData<T> => ({
  data: [],
  pagination: {
    page: 1,
    first: 1,
    last: 1,
    total: 0,
  },
});

export const defaultApiResponse = { data: undefined, error: undefined };

const AppProvider: React.FC<{ children: any }> = ({ children }) => {
  return (
    <BannerProvider>
      <RasProvider>
        <FeedbackProvider>
          <KlantProvider>
            <TrainingProvider>
              <HondProvider>
                <TrainingDayProvider>
                  <InschrijvingProvider>
                    <SubscriptionProvider>
                      <VacationProvider>
                        <UserProvider>
                          <AuthContext>{children}</AuthContext>
                        </UserProvider>
                      </VacationProvider>
                    </SubscriptionProvider>
                  </InschrijvingProvider>
                </TrainingDayProvider>
              </HondProvider>
            </TrainingProvider>
          </KlantProvider>
        </FeedbackProvider>
      </RasProvider>
    </BannerProvider>
  );
};

export default AppProvider;
