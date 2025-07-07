import { getDatesBetween } from '@/utils/get-dates-between';

describe('get-dates-between', () => {
  test('基础场景', () => {
    const start = new Date('2025-01-01T12:44:00');
    const end = new Date('2025-01-03T04:00:00');

    expect(getDatesBetween(start, end)).toEqual([
      '2025-01-01',
      '2025-01-02',
      '2025-01-03'
    ]);
  });

  test('边界 左侧', () => {
    const start = new Date('2025-01-01T00:00:00');
    const end = new Date('2025-01-03T04:00:00');

    expect(getDatesBetween(start, end)).toEqual([
      '2025-01-01',
      '2025-01-02',
      '2025-01-03'
    ]);
  });

  test('边界 右侧', () => {
    const start = new Date('2025-01-01T00:00:00');
    const end = new Date('2025-01-03T00:00:00');

    expect(getDatesBetween(start, end)).toEqual([
      '2025-01-01',
      '2025-01-02',
      '2025-01-03'
    ]);
  });
});