export const roundDownTimeToNearestSeconds = (date:Date, seconds:number):Date => {
  // 将时间转换为 Unix 时间戳（秒）
  const timestamp = Math.floor(date.getTime() / 1000);

  // 向下取整到最近的 seconds 的倍数
  const roundedTimestamp = Math.floor(timestamp / seconds) * seconds;

  // 返回格式化后的时间
  return new Date(roundedTimestamp * 1000);
};