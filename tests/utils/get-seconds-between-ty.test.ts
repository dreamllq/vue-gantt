import { getSecondsBetween, getSecondsBetweenDates } from '@/utils/get-seconds-between';

describe('getSecondsBetween', () => {
  it('should calculate seconds between two valid dates correctly', () => {
    expect(getSecondsBetween('2023-01-01 12:00:00', '2023-01-01 12:00:30')).toBe(30);
    expect(getSecondsBetween('2023-01-01 12:00:30', '2023-01-01 12:00:00')).toBe(30); // 反向顺序
  });

  it('should throw error for invalid date format', () => {
    expect(() => getSecondsBetween('invalid-date', '2023-01-01 12:00:00')).toThrow('Invalid date format');
    expect(() => getSecondsBetween('2023-01-01 12:00:00', 'invalid-date')).toThrow('Invalid date format');
  });
});

describe('getSecondsBetweenDates', () => {
  it('should calculate seconds correctly when dates are valid', () => {
    const date1 = new Date('2023-01-01T12:00:00Z');
    const date2 = new Date('2023-01-01T12:00:45.999Z'); // 45.999 秒
    expect(getSecondsBetweenDates(date1, date2)).toBe(45); // 应向下取整为 45 秒
  });

  it('should throw error for invalid Date objects', () => {
    const invalidDate = new Date('invalid-date');
    expect(() => getSecondsBetweenDates(invalidDate, new Date())).toThrow('Invalid date format');
    expect(() => getSecondsBetweenDates(new Date(), invalidDate)).toThrow('Invalid date format');
  });

  it('should return absolute difference regardless of date order', () => {
    const date1 = new Date('2023-01-01T12:00:00Z');
    const date2 = new Date('2023-01-01T12:01:30Z');
    expect(getSecondsBetweenDates(date1, date2)).toBe(90);
    expect(getSecondsBetweenDates(date2, date1)).toBe(90);
  });
});