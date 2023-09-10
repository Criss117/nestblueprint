export const tokenExpired = (tokenExpiration: Date): boolean => {
  const currentDate = new Date();

  if ((+currentDate - +tokenExpiration) / (1000 * 60 * 60) > 2) return true;

  return false;
};
