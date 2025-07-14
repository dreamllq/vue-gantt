import { getWeek } from 'date-fns/getWeek';

export function dateWeek(date: Date): number {
  return getWeek(date);
}
