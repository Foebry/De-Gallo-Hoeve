import { PaginatedResponse } from 'src/shared/RequestHelper';
import { RasProvider } from './RasContext';

export const emptyPaginatedResponse: PaginatedResponse<any> = {
  data: [],
  pagination: {
    currentPage: 1,
    first: 1,
    last: 1,
    total: 0,
  },
};

const AppProvider: React.FC<{ children: any }> = ({ children }) => {
  return <RasProvider>{children}</RasProvider>;
};

export default AppProvider;
