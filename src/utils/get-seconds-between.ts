export function getSecondsBetween(dateStr1: string, dateStr2: string): number {
  const date1 = new Date(dateStr1.replace(' ', 'T')); // 替换为 ISO 格式
  const date2 = new Date(dateStr2.replace(' ', 'T'));

  return getSecondsBetweenDates(date1, date2);
}

export const getSecondsBetweenDates = (date1:Date, date2:Date) => {
  if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
    throw new Error('Invalid date format');
  }

  const diffMs = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diffMs / 1000); // 转换为秒
};