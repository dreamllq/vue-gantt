import { dateWeek } from '@/utils/date-week';
import moment from 'moment';

describe('date-week', () => {
  test('周日', () => {
    const date = new Date('2025-07-13T00:00:00');
    expect(dateWeek(date)).toBe(moment(date).week());
  }); 
  test('周一', () => {
    const date = new Date('2025-07-14T00:00:00');
    expect(dateWeek(date)).toBe(moment(date).week());
  }); 
  test('年初', () => {
    const date = moment().startOf('year').toDate();
    expect(dateWeek(date)).toBe(moment(date).week());
  }); 
  test('年末', () => {
    const date = moment().endOf('year').toDate();
    expect(dateWeek(date)).toBe(moment(date).week());
  }); 
});