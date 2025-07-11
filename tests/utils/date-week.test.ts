import { dateWeek } from '@/utils/date-week';
import moment from 'moment';

describe('date-week', () => {
  const date = new Date();
  test('base', () => {
    expect(dateWeek(date)).toBe(moment(date).week());
  }); 
});