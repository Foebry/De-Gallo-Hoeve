const logger = {
  debug: (key: string, msg: any) => console.log({ [key]: typeof msg === 'string' ? msg : JSON.stringify(msg) }),
  info: (msg: any) => console.log(`INFO: ${typeof msg === 'string' ? msg : JSON.stringify(msg)}`),
  warning: (msg: any) => console.log(`WARNING: ${typeof msg === 'string' ? msg : JSON.stringify(msg)}`),
  error: (msg: any) => console.log(`ERROR: ${typeof msg === 'string' ? msg : JSON.stringify(msg)}`),
};

export default logger;
