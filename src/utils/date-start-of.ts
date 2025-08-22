import { Unit } from '@/types/unit';
import { startOfDay, startOfWeek, startOfMonth, endOfDay, endOfWeek, endOfMonth, format } from 'date-fns';

export const dateStartOf = (date: Date, unit: Unit): Date => {
  if (unit === Unit.DAY) {
    return startOfDay(date);
  } else if (unit === Unit.WEEK) {
    return startOfWeek(date);
  } else if (unit === Unit.MONTH) {
    return startOfMonth(date);
  }
  return date;
};