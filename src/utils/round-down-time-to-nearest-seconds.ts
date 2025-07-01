import moment, { Moment } from 'moment';

export const roundDownTimeToNearestSeconds = (date:Moment, seconds:number) => {
  // 将时间转换为 Unix 时间戳（秒）
  const timestamp = date.unix();

  // 向下取整到最近的 seconds 的倍数
  const roundedTimestamp = Math.floor(timestamp / seconds) * seconds;

  // 返回格式化后的时间
  return moment.unix(roundedTimestamp);
};