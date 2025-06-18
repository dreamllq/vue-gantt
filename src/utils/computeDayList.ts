import moment, { Moment } from 'moment';

export const computeDayList = (start:Moment, days:number, unit:string) => {
  const dateMoment = start.clone();
  const list:{seconds: number, date: Moment}[] = [];
  for (let i = 0; i < days; i++) {
    if (unit === 'day') {
      list.push({
        seconds: computeOneDayHasHours(dateMoment) * 60 * 60,
        date: dateMoment.clone()
      });
      dateMoment.add(1, 'd');
    } else if (unit === 'week') {
      list.push({
        seconds: computeOneWeekHasHours(dateMoment) * 60 * 60,
        date: dateMoment.clone() 
      });
      dateMoment.add(1, 'week');
    } else if (unit === 'month') {
      list.push({
        seconds: computeOneMonthHasHours(dateMoment) * 60 * 60,
        date: dateMoment.clone() 
      });
      dateMoment.add(1, 'month');
    }
  }
  
  return list;
};

export const computeOneDayHasHours = (dateMoment: Moment) => dateMoment.clone().add(1, 'd').diff(dateMoment.clone(), 'h');

export const computeOneWeekHasHours = (dateMoment: Moment) => dateMoment.clone().add(1, 'week').diff(dateMoment.clone(), 'h');

export const computeOneMonthHasHours = (dateMoment: Moment) => dateMoment.clone().add(1, 'month').diff(dateMoment.clone(), 'h');