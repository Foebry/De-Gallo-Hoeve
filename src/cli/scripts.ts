import path from 'path';
import logger from 'src/utils/logger';
const job = async (obj: Record<string, any>) => {
  if (!Object.keys(obj).includes('script')) return;

  logger.info(`running script ${obj['script']}`);
  const script = path.join('../../src/cronjobs/scripts', obj.script);

  try {
    if (Object.keys(obj).includes('description')) {
      require(script).description();
    } else {
      const handler = require(script).handler;
      await handler(obj['target-env']);
    }
  } catch (error: any) {
    if (error.code === 'MODULE_NOT_FOUND') {
      logger.error(`Could not locate script ${obj.script}`);
      process.exit();
    }
  }
};

export default job;
