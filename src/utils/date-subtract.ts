import { Unit } from '@/types/unit';

export const dateSubtract = (date:Date, duration:number, unit:Unit) => {
  if (unit === Unit.SECOND) {
    return new Date(date.getTime() - (duration * 1000));
  } else if (unit === Unit.MINUTE) {
    return new Date(date.getTime() - (duration * 60 * 1000));
  } else if (unit === Unit.HOUR) {
    return new Date(date.getTime() - (duration * 60 * 60 * 1000));
  } else if (unit === Unit.DAY) {
    return new Date(date.getTime() - (duration * 24 * 60 * 60 * 1000));
  } else if (unit === Unit.WEEK) {
    return new Date(date.getTime() - (duration * 7 * 24 * 60 * 60 * 1000));
  } else if (unit === Unit.MONTH) {
    const d = new Date(date);
    d.setMonth(date.getMonth() - duration);
    return d;
  } else {
    return date;
  }
};