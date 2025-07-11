import { getDatesBetween } from '@/utils/get-dates-between';

describe('get-dates-between', () => {
  test('基础场景', () => {
    expect(getDatesBetween('2025-01-01 12:44:00', '2025-01-03 04:00:00')).toEqual([
      '2025-01-01',
      '2025-01-02',
      '2025-01-03'
    ]);
  });

  test('边界 左侧', () => {
    expect(getDatesBetween('2025-01-01 00:00:00', '2025-01-03 04:00:00')).toEqual([
      '2025-01-01',
      '2025-01-02',
      '2025-01-03'
    ]);
  });

  test('边界 右侧', () => {
    expect(getDatesBetween('2025-01-01 00:00:00', '2025-01-03 00:00:00')).toEqual([
      '2025-01-01',
      '2025-01-02',
      '2025-01-03'
    ]);
  });
});