import { Unit } from '@/types/unit';
import { dateAdd } from '@/utils/date-add';
import { dateTimeFormat } from '@/utils/date-time-format';
import moment from 'moment';

describe('date-add', () => {
  const date = new Date();
  test('second', () => {
    expect(dateTimeFormat(dateAdd(date, 1, Unit.SECOND))).toBe(moment(date).add(1, 'second').format('YYYY-MM-DD HH:mm:ss'));
    expect(dateTimeFormat(dateAdd(date, 400, Unit.SECOND))).toBe(moment(date).add(400, 'second').format('YYYY-MM-DD HH:mm:ss'));
  });

  test('minute', () => {
    expect(dateTimeFormat(dateAdd(date, 1, Unit.MINUTE))).toBe(moment(date).add(1, 'minute').format('YYYY-MM-DD HH:mm:ss'));
    expect(dateTimeFormat(dateAdd(date, 4000, Unit.MINUTE))).toBe(moment(date).add(4000, 'minute').format('YYYY-MM-DD HH:mm:ss'));
  });

  test('hour', () => {
    expect(dateTimeFormat(dateAdd(date, 1, Unit.HOUR))).toBe(moment(date).add(1, 'hour').format('YYYY-MM-DD HH:mm:ss'));
    expect(dateTimeFormat(dateAdd(date, 400, Unit.HOUR))).toBe(moment(date).add(400, 'hour').format('YYYY-MM-DD HH:mm:ss'));
  });

  test('day', () => {
    expect(dateTimeFormat(dateAdd(date, 1, Unit.DAY))).toBe(moment(date).add(1, 'day').format('YYYY-MM-DD HH:mm:ss'));
    expect(dateTimeFormat(dateAdd(date, 400, Unit.DAY))).toBe(moment(date).add(400, 'day').format('YYYY-MM-DD HH:mm:ss'));
  });

  test('week', () => {
    expect(dateTimeFormat(dateAdd(date, 1, Unit.WEEK))).toBe(moment(date).add(1, 'week').format('YYYY-MM-DD HH:mm:ss'));
    expect(dateTimeFormat(dateAdd(date, 400, Unit.WEEK))).toBe(moment(date).add(400, 'week').format('YYYY-MM-DD HH:mm:ss'));
  });

  test('month', () => {
    expect(dateTimeFormat(dateAdd(date, 1, Unit.MONTH))).toBe(moment(date).add(1, 'month').format('YYYY-MM-DD HH:mm:ss'));
    expect(dateTimeFormat(dateAdd(date, 400, Unit.MONTH))).toBe(moment(date).add(400, 'month').format('YYYY-MM-DD HH:mm:ss'));
  });
});