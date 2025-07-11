import { Unit } from '@/types/unit';
import { dateAdd } from './date-add';
import { dateDiff } from './date-diff';

export const computeDayList = (start:Date, days:number, unit:string):{
    seconds: number;
    date: Date;
}[] => {
  let date = start;
  const list:{seconds: number, date: Date}[] = [];
  for (let i = 0; i < days; i++) {
    if (unit === Unit.DAY) {
      list.push({
        seconds: computeOneDayHasHours(date) * 60 * 60,
        date: date
      });
      date = dateAdd(date, 1, Unit.DAY);
    } else if (unit === Unit.WEEK) {
      list.push({
        seconds: computeOneWeekHasHours(date) * 60 * 60,
        date: date 
      });
      date = dateAdd(date, 1, Unit.WEEK);
    } else if (unit === Unit.MONTH) {
      list.push({
        seconds: computeOneMonthHasHours(date) * 60 * 60,
        date: date 
      });
      date = dateAdd(date, 1, Unit.MONTH);
    }
  }
  
  return list;
};

export const computeOneDayHasHours = (date: Date) => dateDiff(dateAdd(date, 1, Unit.DAY), date, Unit.HOUR);

export const computeOneWeekHasHours = (date: Date) => dateDiff(dateAdd(date, 1, Unit.WEEK), date, Unit.HOUR);

export const computeOneMonthHasHours = (date: Date) => dateDiff(dateAdd(date, 1, Unit.MONTH), date, Unit.HOUR);