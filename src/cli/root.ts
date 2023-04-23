import logger from 'src/utils/logger';
import yargs from 'yargs';
import job from './jobs';
import script from './scripts';
// import email from './emails';

const setup = async () => {
  const argsv = await yargs.argv;
  const args = argsv._.map((el) => {
    const [key, value] = el.toString().split('=');
    return { [key]: value };
  }).reduce(
    (acc: Record<string, string>, curr: Record<string, string>) => ({ ...acc, ...curr }),
    {}
  );

  if (!args['target-env']) {
    logger.warning(
      ' No target environment was picked, falling back to test-environment. Target environments can be [test - develop - accept - production]'
    );
    args['target-env'] = 'test';
  }
  require('dotenv').config({ path: `.env.${args['target-env']}.local` });
  if (!process.env.NODE_ENV) {
    logger.error(
      `Environment variables not loaded correctly. Target-env: ${args['target-env']}`
    );

    process.exit();
  }
  job(args);

  script(args);
};

setup();
