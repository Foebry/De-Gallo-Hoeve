import { closeClient } from 'src/utils/db';
import { clearAllData } from 'src/utils/MongoDb';
import * as errorLogger from 'src/pages/api/logError/repo';

beforeAll(async () => {
  jest.spyOn(errorLogger, 'logError').mockImplementation(async () => {});
});

afterAll(async () => {
  await clearAllData();
  return closeClient();
});

afterEach(async () => {
  await clearAllData();
  jest.clearAllMocks();
});
