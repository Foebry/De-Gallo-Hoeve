import { PaginatedResponse } from 'src/shared/RequestHelper';
import AuthContext from '../authContext';
import FeedbackProvider from './FeedbackContext';
import HondProvider from './hondContext';
import InschrijvingProvider from './InschrijvingContext';
import KlantProvider from './klantContext';
import { RasProvider } from './RasContext';
import TrainingProvider from './TrainingContext';
import TrainingDayProvider from './TrainingDayContext';
import UserProvider from './UserContext';

export const emptyPaginatedResponse: PaginatedResponse<any> = {
  data: [],
  pagination: {
    currentPage: 1,
    first: 1,
    last: 1,
    total: 0,
  },
};

export const defaultApiResponse = { data: undefined, error: undefined };

const AppProvider: React.FC<{ children: any }> = ({ children }) => {
  return (
    <RasProvider>
      <FeedbackProvider>
        <KlantProvider>
          <TrainingProvider>
            <HondProvider>
              <TrainingDayProvider>
                <InschrijvingProvider>
                  <UserProvider>
                    <AuthContext>{children}</AuthContext>
                  </UserProvider>
                </InschrijvingProvider>
              </TrainingDayProvider>
            </HondProvider>
          </TrainingProvider>
        </KlantProvider>
      </FeedbackProvider>
    </RasProvider>
  );
};

export default AppProvider;
