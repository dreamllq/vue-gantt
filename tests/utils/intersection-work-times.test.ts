import intersectionWorkTimes, { intersectionWorkTime } from '@/utils/intersection-work-times';


describe('intersectionWorkTime 交集', () => {
  test('有交集', () => {
    const result = intersectionWorkTime({
      start: '2024-01-01 12:00:00',
      end: '2024-01-01 18:00:00'
    }, {
      start: '2024-01-01 16:00:00',
      end: '2024-01-01 19:00:00'
    });

    expect(result!.start).toBe('2024-01-01 16:00:00');
    expect(result!.end).toBe('2024-01-01 18:00:00');
  }); 

  test('无交集', () => {
    const result = intersectionWorkTime({
      start: '2024-01-01 12:00:00',
      end: '2024-01-01 18:00:00'
    }, {
      start: '2024-01-01 19:00:00',
      end: '2024-01-01 20:00:00'
    });

    expect(result).toBe(null);
  });

  test('无交集2', () => {
    const result = intersectionWorkTime({
      start: '2024-01-01 12:00:00',
      end: '2024-01-01 18:00:00'
    }, {
      start: '2024-01-01 18:00:00',
      end: '2024-01-01 20:00:00'
    });

    expect(result).toBe(null);
  });
});

describe('intersectionWorkTimes 交集', () => {
  test('有交集', () => {
    const result = intersectionWorkTimes([
      {
        start: '2024-01-01 12:00:00',
        end: '2024-01-01 18:00:00'
      }
    ], [
      {
        start: '2024-01-01 16:00:00',
        end: '2024-01-01 19:00:00'
      }
    ]);

    expect(result.length).toBe(1);
    expect(result[0]!.start).toBe('2024-01-01 16:00:00');
    expect(result[0]!.end).toBe('2024-01-01 18:00:00');
  }); 

  test('多数据交集', () => {
    const result = intersectionWorkTimes([
      {
        start: '2024-01-01 12:00:00',
        end: '2024-01-01 18:00:00'
      }
    ], [
      {
        start: '2024-01-01 09:00:00',
        end: '2024-01-01 10:00:00'
      },
      {
        start: '2024-01-01 11:00:00',
        end: '2024-01-01 13:00:00'
      },
      {
        start: '2024-01-01 14:00:00',
        end: '2024-01-01 15:00:00'
      },
      {
        start: '2024-01-01 16:00:00',
        end: '2024-01-01 19:00:00'
      },
      {
        start: '2024-01-01 20:00:00',
        end: '2024-01-01 24:00:00'
      }
    ]);

    expect(result.length).toBe(3);
    expect(result[0]!.start).toBe('2024-01-01 12:00:00');
    expect(result[0]!.end).toBe('2024-01-01 13:00:00');
    expect(result[1]!.start).toBe('2024-01-01 14:00:00');
    expect(result[1]!.end).toBe('2024-01-01 15:00:00');
    expect(result[2]!.start).toBe('2024-01-01 16:00:00');
    expect(result[2]!.end).toBe('2024-01-01 18:00:00');
  });
});