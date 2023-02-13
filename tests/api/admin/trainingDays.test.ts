import logger from 'src/utils/logger';

describe('Admin trainingDays', () => {
  describe('/ GET', () => {
    it.skip('should return a list of activated TrainingDays', async () => {
      logger.info('test');
    });

    it.skip('Should throw UnauthorizedError when not admin', async () => {
      logger.error('unauthorized');
    });
  });

  describe('/ PUT', () => {
    it.skip('Should update activated TrainingDays', async () => {
      logger.info('test');
    });
    it.skip('Should throw UnauthorizedError when not admin', async () => {
      logger.error('unauthorized');
    });
  });
});
