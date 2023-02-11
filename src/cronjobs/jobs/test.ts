export const handler = (env: string) => {
  if (!env) {
    console.log(
      `ERROR: please pick a target environment to run at. Target-environments are: [test - development - accept - production]`
    );
    process.exit();
  }
  console.log(`running job for env: ${env}`);
};

// export default handler;
