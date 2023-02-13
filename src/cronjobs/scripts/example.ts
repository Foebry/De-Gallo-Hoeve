import logger from 'src/utils/logger';

export const handler = (env: string) => {
  if (!env) {
    logger.error(
      `please pick a target environment to run at. Target-environments are: [test - development - accept - production]`
    );
    process.exit();
  }
  logger.info(`running script for env: ${env}`);
};
