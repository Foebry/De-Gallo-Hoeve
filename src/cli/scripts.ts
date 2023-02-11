import path from 'path';
const job = (obj: Record<string, any>) => {
  if (!Object.keys(obj).includes('script')) return;

  console.log(`running script ${obj['script']}`);
  const script = path.join('../../src/cronjobs/scripts', obj.script);

  try {
    if (Object.keys(obj).includes('description')) {
      require(script).description();
    } else require(script).handler(obj['target-env']);
  } catch (error: any) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.log(`ERROR: Could not locate script ${obj.script}`);
      process.exit();
    }
  }
};

const description = () => {};

export default job;
