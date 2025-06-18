import { Moment } from 'moment';

export const computeDayScale = (start: Moment) => {
  const scales:{leftSeconds: number, hour: number, date: Moment}[] = [];
  const tempDate = start.clone();
  for (let i = 0; i < 24; i++) {
    // 不用moment().add(1,'hour')主要是因为夏令时和非夏令时的时区同的问题
    let end;
    let hour = start.hour() + i;
    if (hour === 24) {
      tempDate.add(1, 'd');
    }

    if (hour >= 24) {
      hour = hour - 24;
    }
    end = tempDate.hour(hour);
    const seconds = computeAfterHoursDiffStart(start, end);
    scales.push({
      leftSeconds: seconds,
      hour: end.hour(),
      date: tempDate
    });
  }
  return scales;
};

export const computeAfterHoursDiffStart = (start: Moment, end: Moment) => end.diff(start, 'second');