import { Unit } from '@/types/unit';
import { getSecondsBetweenDates } from './get-seconds-between';

export const dateDiff = (date1: Date, date2: Date, unit: Unit): number => {
  if (unit === Unit.SECOND) {
    const seconds = getSecondsBetweenDates(date1, date2);
    return seconds;
  } else if (unit === Unit.MINUTE) {
    const seconds = getSecondsBetweenDates(date1, date2);
    return Math.floor(seconds / 60);
  } else if (unit === Unit.HOUR) {
    const seconds = getSecondsBetweenDates(date1, date2);
    return Math.floor(seconds / 60 / 60);
  } else if (unit === Unit.DAY) {
    const seconds = getSecondsBetweenDates(date1, date2);
    return Math.floor(seconds / 60 / 60 / 24);
  } else if (unit === Unit.WEEK) {
    const seconds = getSecondsBetweenDates(date1, date2);
    return Math.floor(seconds / 60 / 60 / 24 / 7);
  } else if (unit === Unit.MONTH) {
    return diffInMonths(date1, date2);
  } else {
    return 0;
  }
};

function diffInMonths(date1: Date, date2: Date): number {

  let start:Date, end:Date;
  if (date1.getTime() < date2.getTime()) {
    start = date1;
    end = date2;
  } else {
    start = date2;
    end = date1;
  }

  const yearDiff = end.getFullYear() - start.getFullYear();
  const monthDiff = end.getMonth() - start.getMonth();
  const dayDiff = end.getDate() - start.getDate();

  // 总共相差多少个月（只取完整月份）
  let totalMonths = yearDiff * 12 + monthDiff;

  // 如果 end 的“日”小于 start 的“日”，则不算完整的月份
  if (dayDiff < 0) {
    totalMonths--;
  }

  return totalMonths;
}