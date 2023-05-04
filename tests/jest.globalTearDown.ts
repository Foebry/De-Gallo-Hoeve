import { closeClient } from '../src/utils/db';

const tearDown = async () => {
  return closeClient();
};

export default tearDown;
