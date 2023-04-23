export const getLinkExpirationTime = (code: string) => {
  return [parseInt(code, 36)];
};
