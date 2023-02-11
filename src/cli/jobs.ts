import path from 'path';
const job = (obj: Record<string, any>) => {
  if (!Object.keys(obj).includes('job')) return;

  console.log(`running job ${obj['job']}`);
  const job = path.join('../../src/cronjobs/jobs', obj.job);

  try {
    require(job).handler(obj['target-env']);
  } catch (error: any) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.log(`ERROR: Could not locate job ${obj.job}`);
      process.exit();
    }
  }
};

export default job;
