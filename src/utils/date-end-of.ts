import { Unit } from '@/types/unit';
import { startOfDay, startOfWeek, startOfMonth, endOfDay, endOfWeek, endOfMonth, format } from 'date-fns';

export const dateEndOf = (date: Date, unit: Unit): Date => {
  if (unit === Unit.DAY) {
    return endOfDay(date);
  } else if (unit === Unit.WEEK) {
    return endOfWeek(date);
  } else if (unit === Unit.MONTH) {
    return endOfMonth(date);
  }
  return date;
};