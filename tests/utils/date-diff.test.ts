import { Unit } from '@/types/unit';
import { dateDiff } from '@/utils/date-diff';
import moment from 'moment';

describe('date-subtract', () => {
  const date1 = moment('2024-06-09 00:01:02', 'YYYY-MM-DD HH:mm:ss').toDate();
  const date2 = moment('2025-05-19 11:41:32', 'YYYY-MM-DD HH:mm:ss').toDate();

  test('second', () => {
    expect(dateDiff(date1, date2, Unit.SECOND)).toBe(moment(date2).diff(moment(date1), 'second'));
  });

  test('minute', () => {
    expect(dateDiff(date1, date2, Unit.MINUTE)).toBe(moment(date2).diff(moment(date1), 'minute'));
    const date3 = moment('2024-06-09 00:01:02', 'YYYY-MM-DD HH:mm:ss').toDate();
    const date4 = moment('2024-06-09 00:01:03', 'YYYY-MM-DD HH:mm:ss').toDate();
    expect(dateDiff(date3, date4, Unit.MINUTE)).toBe(moment(date4).diff(moment(date3), 'minute'));
    const date5 = moment('2024-06-09 00:01:02', 'YYYY-MM-DD HH:mm:ss').toDate();
    const date6 = moment('2024-06-09 00:02:03', 'YYYY-MM-DD HH:mm:ss').toDate();
    expect(dateDiff(date5, date6, Unit.MINUTE)).toBe(moment(date6).diff(moment(date5), 'minute'));
  });

  test('hour', () => {
    expect(dateDiff(date1, date2, Unit.HOUR)).toBe(moment(date2).diff(moment(date1), 'hour'));
    const date3 = moment('2024-06-09 00:01:02', 'YYYY-MM-DD HH:mm:ss').toDate();
    const date4 = moment('2024-06-09 00:01:03', 'YYYY-MM-DD HH:mm:ss').toDate();
    expect(dateDiff(date3, date4, Unit.HOUR)).toBe(moment(date4).diff(moment(date3), 'hour'));
    const date5 = moment('2024-06-09 00:01:02', 'YYYY-MM-DD HH:mm:ss').toDate();
    const date6 = moment('2024-06-09 01:02:03', 'YYYY-MM-DD HH:mm:ss').toDate();
    expect(dateDiff(date5, date6, Unit.HOUR)).toBe(moment(date6).diff(moment(date5), 'hour'));
  });

  test('day', () => {
    expect(dateDiff(date1, date2, Unit.DAY)).toBe(moment(date2).diff(moment(date1), 'day'));
    const date3 = moment('2024-06-09 00:01:02', 'YYYY-MM-DD HH:mm:ss').toDate();
    const date4 = moment('2024-06-09 00:01:03', 'YYYY-MM-DD HH:mm:ss').toDate();
    expect(dateDiff(date3, date4, Unit.DAY)).toBe(moment(date4).diff(moment(date3), 'day'));
    const date5 = moment('2024-06-09 00:01:02', 'YYYY-MM-DD HH:mm:ss').toDate();
    const date6 = moment('2024-06-10 01:02:03', 'YYYY-MM-DD HH:mm:ss').toDate();
    expect(dateDiff(date5, date6, Unit.DAY)).toBe(moment(date6).diff(moment(date5), 'day'));

    {
      const date5 = moment('2024-06-09 00:01:02', 'YYYY-MM-DD HH:mm:ss').toDate();
      const date6 = moment('2024-06-10 01:02:03', 'YYYY-MM-DD HH:mm:ss').toDate();
      expect(dateDiff(date5, date6, Unit.DAY)).toBe(1);
    }
  });

  test('week', () => {
    expect(dateDiff(date1, date2, Unit.WEEK)).toBe(moment(date2).diff(moment(date1), 'week'));
    const date3 = moment('2024-06-09 00:01:02', 'YYYY-MM-DD HH:mm:ss').toDate();
    const date4 = moment('2024-06-09 00:01:03', 'YYYY-MM-DD HH:mm:ss').toDate();
    expect(dateDiff(date3, date4, Unit.WEEK)).toBe(moment(date4).diff(moment(date3), 'week'));
    const date5 = moment('2024-06-09 00:01:02', 'YYYY-MM-DD HH:mm:ss').toDate();
    const date6 = moment('2024-06-16 01:02:03', 'YYYY-MM-DD HH:mm:ss').toDate();
    expect(dateDiff(date5, date6, Unit.WEEK)).toBe(moment(date6).diff(moment(date5), 'week'));

    { 
      const date5 = moment('2025-08-04 00:01:02', 'YYYY-MM-DD HH:mm:ss').toDate();
      const date6 = moment('2025-08-11 01:02:03', 'YYYY-MM-DD HH:mm:ss').toDate();
      expect(dateDiff(date5, date6, Unit.WEEK)).toBe(1);
    }

    { 
      const date5 = moment('2025-08-04 00:01:02', 'YYYY-MM-DD HH:mm:ss').toDate();
      const date6 = moment('2025-08-06 01:02:03', 'YYYY-MM-DD HH:mm:ss').toDate();
      expect(dateDiff(date5, date6, Unit.WEEK)).toBe(0);
    }
  });

  test('month', () => {
    expect(dateDiff(date1, date2, Unit.MONTH)).toBe(moment(date2).diff(moment(date1), 'month'));
    const date3 = moment('2024-06-09 00:01:02', 'YYYY-MM-DD HH:mm:ss').toDate();
    const date4 = moment('2024-06-09 00:01:03', 'YYYY-MM-DD HH:mm:ss').toDate();
    expect(dateDiff(date3, date4, Unit.MONTH)).toBe(moment(date4).diff(moment(date3), 'month'));
    const date5 = moment('2024-06-09 00:01:02', 'YYYY-MM-DD HH:mm:ss').toDate();
    const date6 = moment('2024-07-08 01:02:03', 'YYYY-MM-DD HH:mm:ss').toDate();
    expect(dateDiff(date5, date6, Unit.MONTH)).toBe(moment(date6).diff(moment(date5), 'month'));

    { 
      const date5 = moment('2024-06-01 00:01:02', 'YYYY-MM-DD HH:mm:ss').toDate();
      const date6 = moment('2024-07-31 01:02:03', 'YYYY-MM-DD HH:mm:ss').toDate();
      expect(dateDiff(date5, date6, Unit.MONTH)).toBe(1); 
    }

    { 
      const date5 = moment('2024-06-01 00:01:02', 'YYYY-MM-DD HH:mm:ss').toDate();
      const date6 = moment('2024-06-30 01:02:03', 'YYYY-MM-DD HH:mm:ss').toDate();
      expect(dateDiff(date5, date6, Unit.MONTH)).toBe(0); 
    }
  });
});