const logger = {
  debug: (key: string, msg: any) => console.log({ [key]: msg }),
  info: (msg: string) => console.log(`INFO: ${msg}`),
  warning: (msg: string) => console.log(`WARNING: ${msg}`),
  error: (msg: string) => console.log(`ERROR: ${msg}`),
};

export default logger;
