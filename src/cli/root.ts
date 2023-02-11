import yargs from 'yargs';
import job from './jobs';
import script from './scripts';
// import email from './emails';

const args = yargs.argv._.reduce((acc: Record<string, any>, curr: string) => {
  const [key, value] = curr.split('=');
  return { ...acc, [key]: value };
}, {});

if (!args['target-env']) {
  console.log(
    `ERROR: Please pick a target environment. Target environments can be [test - develop - accept - production]`
  );
  process.exit();
}
require('dotenv').config({ path: `.env.${args['target-env']}.local` });
if (!process.env.NODE_ENV) {
  console.log(
    `ERROR: Environment variables not loaded correctly. Target-env: ${args['target-env']}`
  );
  process.exit();
}

job(args);

script(args);

// email(chunks);
