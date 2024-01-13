import path from 'path';
import logger from 'src/utils/logger';
const job = async (obj: Record<string, any>) => {
  if (!Object.keys(obj).includes('job')) return;

  logger.info(`running job ${obj['job']}`);
  const job = path.join('../../src/cronjobs/jobs', obj.job);

  try {
    const handler = require(job).handler;
    await handler(obj['target-env']);
  } catch (error: any) {
    if (error.code === 'MODULE_NOT_FOUND') {
      logger.info(`ERROR: Could not locate job ${obj.job}`);
      process.exit();
    }
  }
};

export default job;
