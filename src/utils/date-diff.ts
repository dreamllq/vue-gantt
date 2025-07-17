import { Unit } from '@/types/unit';
import { getSecondsBetweenDates } from './get-seconds-between';
import { differenceInMonths } from 'date-fns/differenceInMonths';
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
    return Math.abs(differenceInMonths(date1, date2));
  } else {
    return 0;
  }
};