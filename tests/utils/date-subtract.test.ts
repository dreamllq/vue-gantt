import { Unit } from '@/types/unit';
import { dateSubtract } from '@/utils/date-subtract';
import { dateTimeFormat } from '@/utils/date-time-format';
import moment from 'moment';

describe('date-subtract', () => {
  const date = new Date();
  test('second', () => {
    expect(dateTimeFormat(dateSubtract(date, 1, Unit.SECOND))).toBe(moment(date).subtract(1, 'second').format('YYYY-MM-DD HH:mm:ss'));
    expect(dateTimeFormat(dateSubtract(date, 400, Unit.SECOND))).toBe(moment(date).subtract(400, 'second').format('YYYY-MM-DD HH:mm:ss'));
  });

  test('minute', () => {
    expect(dateTimeFormat(dateSubtract(date, 1, Unit.MINUTE))).toBe(moment(date).subtract(1, 'minute').format('YYYY-MM-DD HH:mm:ss'));
    expect(dateTimeFormat(dateSubtract(date, 4000, Unit.MINUTE))).toBe(moment(date).subtract(4000, 'minute').format('YYYY-MM-DD HH:mm:ss'));
  });

  test('hour', () => {
    expect(dateTimeFormat(dateSubtract(date, 1, Unit.HOUR))).toBe(moment(date).subtract(1, 'hour').format('YYYY-MM-DD HH:mm:ss'));
    expect(dateTimeFormat(dateSubtract(date, 400, Unit.HOUR))).toBe(moment(date).subtract(400, 'hour').format('YYYY-MM-DD HH:mm:ss'));
  });

  test('day', () => {
    expect(dateTimeFormat(dateSubtract(date, 1, Unit.DAY))).toBe(moment(date).subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'));
    expect(dateTimeFormat(dateSubtract(date, 400, Unit.DAY))).toBe(moment(date).subtract(400, 'day').format('YYYY-MM-DD HH:mm:ss'));
  });

  test('week', () => {
    expect(dateTimeFormat(dateSubtract(date, 1, Unit.WEEK))).toBe(moment(date).subtract(1, 'week').format('YYYY-MM-DD HH:mm:ss'));
    expect(dateTimeFormat(dateSubtract(date, 400, Unit.WEEK))).toBe(moment(date).subtract(400, 'week').format('YYYY-MM-DD HH:mm:ss'));
  });

  test('month', () => {
    expect(dateTimeFormat(dateSubtract(date, 1, Unit.MONTH))).toBe(moment(date).subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss'));
    expect(dateTimeFormat(dateSubtract(date, 400, Unit.MONTH))).toBe(moment(date).subtract(400, 'month').format('YYYY-MM-DD HH:mm:ss'));
  });
});