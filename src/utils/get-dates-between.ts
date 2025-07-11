import { dateFormat } from './date-format';
import { strToDate } from './to-date';

export function getDatesBetween(startStr: string, endStr: string): string[] {
  // 将字符串转成 Date 对象
  const startDate = strToDate(startStr);
  const endDate = strToDate(endStr);

  if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error('Invalid date format');
  }

  const dates: string[] = [];

  // 只保留日期部分（本地时区）
  const currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const finalDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

  while (currentDate <= finalDate) {
    dates.push(dateFormat(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}