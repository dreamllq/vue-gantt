import { dateAdd } from './date-add';
import { Unit } from '@/types/unit';
import { dateDiff } from './date-diff';

export const computeDayScale = (start: Date) => {
  const scales:{leftSeconds: number, hour: number, date: Date}[] = [];
  let tempDate = new Date(start);
  for (let i = 0; i < 24; i++) {
    // 处理时间主要是因为夏令时和非夏令时的时区同的问题
    let hour = start.getHours() + i;
    if (hour === 24) {
      tempDate = dateAdd(tempDate, 1, Unit.DAY);
    }

    if (hour >= 24) {
      hour = hour - 24;
    }
    tempDate.setHours(hour);
    const end = tempDate;
    const seconds = computeAfterHoursDiffStart(start, end);
    scales.push({
      leftSeconds: seconds,
      hour: end.getHours(),
      date: tempDate
    });
  }
  return scales;
};

export const computeAfterHoursDiffStart = (start: Date, end: Date) => dateDiff(end, start, Unit.SECOND);