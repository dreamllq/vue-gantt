export const computeTimeSecond = (time:string) => {
  const date = new Date(time.replace(' ', 'T'));
  return Math.floor(date.getTime() / 1000);
};