import TimeRange from '@/utils/time-range/index.ts';

describe('time-range 正序', () => {
  test('测试获取可用的时间周期-不涉及休息日', () => {
    const startDate = '2023-03-02 01:00:00';
    const duration = 7200;
    const unit = 'second';
    const step = 1;
    const workTimes = [
      {
        start: '2023-03-02 00:00:00',
        end: '2023-03-02 08:00:00' 
      },
      {
        start: '2023-03-02 08:30:00',
        end: '2023-03-03 02:00:00'
      }
    ];

    const timeRangeEntity = new TimeRange({
      startDate: startDate,
      duration: duration,
      step: step,
      unit: unit,
      workTimes: workTimes
    });

    const timeRange = timeRangeEntity.calculateTimeRange();
    expect(timeRange.start.format('YYYY-MM-DD HH:mm:ss')).toBe('2023-03-02 01:00:00');
    expect(timeRange.end.format('YYYY-MM-DD HH:mm:ss')).toBe('2023-03-02 03:00:00');
    // expect(timeRangeEntity.workTimeList.length).toBe(1);
    // expect(timeRangeEntity.holidayTimeList.length).toBe(0);
  });

  test('测试获取可用的时间周期-跨休息日', () => {
    const startDate = '2023-03-02 07:00:00';
    const duration = 7200;
    const unit = 'second';
    const step = 1;
    const workTimes = [
      {
        start: '2023-03-02 00:00:00',
        end: '2023-03-02 08:00:00' 
      },
      {
        start: '2023-03-02 08:30:00',
        end: '2023-03-03 02:00:00'
      }
    ];

    const timeRangeEntity = new TimeRange({
      startDate: startDate,
      duration: duration,
      step: step,
      unit: unit,
      workTimes: workTimes
    });

    const timeRange = timeRangeEntity.calculateTimeRange();
    expect(timeRange.start.format('YYYY-MM-DD HH:mm:ss')).toBe('2023-03-02 07:00:00');
    expect(timeRange.end.format('YYYY-MM-DD HH:mm:ss')).toBe('2023-03-02 09:30:00');
    // expect(timeRangeEntity.workTimeList.length).toBe(2);
    // expect(timeRangeEntity.workTimeList[0].start.format('YYYY-MM-DD HH:mm:ss')).toBe('2023-03-02 07:00:00');
    // expect(timeRangeEntity.workTimeList[0].end.format('YYYY-MM-DD HH:mm:ss')).toBe('2023-03-02 08:00:00');
    // expect(timeRangeEntity.workTimeList[1].start.format('YYYY-MM-DD HH:mm:ss')).toBe('2023-03-02 08:30:00');
    // expect(timeRangeEntity.workTimeList[1].end.format('YYYY-MM-DD HH:mm:ss')).toBe('2023-03-02 09:30:00');
    // expect(timeRangeEntity.holidayTimeList.length).toBe(1);
    // expect(timeRangeEntity.holidayTimeList[0].start.format('YYYY-MM-DD HH:mm:ss')).toBe('2023-03-02 08:00:00');
    // expect(timeRangeEntity.holidayTimeList[0].end.format('YYYY-MM-DD HH:mm:ss')).toBe('2023-03-02 08:30:00');
  });

  test('测试获取可用的时间周期，起始时间在休息时段', () => {
    const startDate = '2023-03-02 08:20:00';
    const duration = 7200;
    const unit = 'second';
    const step = 1;
    const workTimes = [
      {
        start: '2023-03-02 00:00:00',
        end: '2023-03-02 08:00:00' 
      },
      {
        start: '2023-03-02 08:30:00',
        end: '2023-03-03 02:00:00'
      }
    ];

    const timeRangeEntity = new TimeRange({
      startDate: startDate,
      duration: duration,
      step: step,
      unit: unit,
      workTimes: workTimes
    });

    const timeRange = timeRangeEntity.calculateTimeRange();
    expect(timeRange.start.format('YYYY-MM-DD HH:mm:ss')).toBe('2023-03-02 08:30:00');
    expect(timeRange.end.format('YYYY-MM-DD HH:mm:ss')).toBe('2023-03-02 10:30:00');
  });

  test('测试获取可用的时间周期，结束时间在休息时段', () => {
    const startDate = '2023-03-02 06:20:00';
    const duration = 7200;
    const unit = 'second';
    const step = 1;
    const workTimes = [
      {
        start: '2023-03-02 00:00:00',
        end: '2023-03-02 08:00:00' 
      },
      {
        start: '2023-03-02 08:30:00',
        end: '2023-03-03 02:00:00'
      }
    ];

    const timeRangeEntity = new TimeRange({
      startDate: startDate,
      duration: duration,
      step: step,
      unit: unit,
      workTimes: workTimes
    });

    const timeRange = timeRangeEntity.calculateTimeRange();
    expect(timeRange.start.format('YYYY-MM-DD HH:mm:ss')).toBe('2023-03-02 06:20:00');
    expect(timeRange.end.format('YYYY-MM-DD HH:mm:ss')).toBe('2023-03-02 08:50:00');
  });

  test('测试获取可用的时间周期，结束时间跨越休息时段', () => {
    const startDate = '2023-03-02 07:20:00';
    const duration = 7200;
    const unit = 'second';
    const step = 1;
    const workTimes = [
      {
        start: '2023-03-02 00:00:00',
        end: '2023-03-02 08:00:00' 
      },
      {
        start: '2023-03-02 08:30:00',
        end: '2023-03-03 02:00:00'
      }
    ];

    const timeRangeEntity = new TimeRange({
      startDate: startDate,
      duration: duration,
      step: step,
      unit: unit,
      workTimes: workTimes
    });

    const timeRange = timeRangeEntity.calculateTimeRange();
    expect(timeRange.start.format('YYYY-MM-DD HH:mm:ss')).toBe('2023-03-02 07:20:00');
    expect(timeRange.end.format('YYYY-MM-DD HH:mm:ss')).toBe('2023-03-02 09:50:00');
  });

  test('测试获取可用的时间周期，开始时间为休息日开始时间', () => {
    const startDate = '2023-03-02 08:00:00';
    const duration = 7200;
    const unit = 'second';
    const step = 1;
    const workTimes = [
      {
        start: '2023-03-02 00:00:00',
        end: '2023-03-02 08:00:00' 
      },
      {
        start: '2023-03-02 08:30:00',
        end: '2023-03-03 02:00:00'
      }
    ];

    const timeRangeEntity = new TimeRange({
      startDate: startDate,
      duration: duration,
      step: step,
      unit: unit,
      workTimes: workTimes
    });
    const timeRange = timeRangeEntity.calculateTimeRange();
    expect(timeRange.start.format('YYYY-MM-DD HH:mm:ss')).toBe('2023-03-02 08:30:00');
    expect(timeRange.end.format('YYYY-MM-DD HH:mm:ss')).toBe('2023-03-02 10:30:00');
  });

  test('空时间 duration = 0', () => {
    const startDate = '2023-03-02 09:00:00';
    const duration = 0;
    const unit = 'second';
    const step = 1;
    const workTimes = [
      {
        start: '2023-03-02 00:00:00',
        end: '2023-03-02 08:00:00' 
      },
      {
        start: '2023-03-02 08:30:00',
        end: '2023-03-03 02:00:00'
      }
    ];

    const timeRangeEntity = new TimeRange({
      startDate: startDate,
      duration: duration,
      step: step,
      unit: unit,
      workTimes: workTimes
    });
    const timeRange = timeRangeEntity.calculateTimeRange();
    expect(timeRange.start.format('YYYY-MM-DD HH:mm:ss')).toBe('2023-03-02 09:00:00');
    expect(timeRange.end.format('YYYY-MM-DD HH:mm:ss')).toBe('2023-03-02 09:00:00');
  });

  test('多班次', () => {
    const startDate = '2023-03-03 09:00:00';
    const duration = 7200;
    const unit = 'second';
    const step = 1;
    const workTimes = [
      {
        start: '2023-03-02 00:00:00',
        end: '2023-03-02 08:00:00' 
      },
      {
        start: '2023-03-02 08:30:00',
        end: '2023-03-03 02:00:00'
      },
      {
        start: '2023-03-03 08:30:00',
        end: '2023-03-04 02:00:00'
      },
      {
        start: '2023-03-04 08:30:00',
        end: '2023-03-05 02:00:00'
      }
    ];

    const timeRangeEntity = new TimeRange({
      startDate: startDate,
      duration: duration,
      step: step,
      unit: unit,
      workTimes: workTimes
    });
    const timeRange = timeRangeEntity.calculateTimeRange();
    expect(timeRange.start.format('YYYY-MM-DD HH:mm:ss')).toBe('2023-03-03 09:00:00');
    expect(timeRange.end.format('YYYY-MM-DD HH:mm:ss')).toBe('2023-03-03 11:00:00');
  });

  describe('非贪婪模式', () => {
    const duration = 3600;
    const unit = 'second';
    const step = 1;
    const workTimes = [
      {
        start: '2023-03-02 00:00:00',
        end: '2023-03-02 08:00:00' 
      },
      {
        start: '2023-03-02 08:30:00',
        end: '2023-03-03 02:00:00'
      }
    ];

    test('测试结束时间命中到休息日的开始时间，结束时间为休息时间的开始时间', () => {
      const startDate = '2023-03-02 07:00:00';
      const timeRangeEntity = new TimeRange({
        startDate: startDate,
        duration: duration,
        step: step,
        unit: unit,
        workTimes: workTimes
      });
  
      const timeRange = timeRangeEntity.calculateTimeRange();
      expect(timeRange.start.format('YYYY-MM-DD HH:mm:ss')).toBe('2023-03-02 07:00:00');
      expect(timeRange.end.format('YYYY-MM-DD HH:mm:ss')).toBe('2023-03-02 08:00:00');
    });

    test('测试开始时间命中到休息日的开始时间，开始时间为休息日的结束时间', () => {
      const startDate = '2023-03-02 08:00:00';
      const timeRangeEntity = new TimeRange({
        startDate: startDate,
        duration: duration,
        step: step,
        unit: unit,
        workTimes: workTimes
      });
  
      const timeRange = timeRangeEntity.calculateTimeRange();
      expect(timeRange.start.format('YYYY-MM-DD HH:mm:ss')).toBe('2023-03-02 08:30:00');
      expect(timeRange.end.format('YYYY-MM-DD HH:mm:ss')).toBe('2023-03-02 09:30:00');
    });

    test('测试开始时间为(班次结束时间/休息日开始时间)', () => {
      const startDate = '2023-03-02 08:00:00';
      const timeRangeEntity = new TimeRange({
        startDate: startDate,
        duration: duration,
        step: step,
        unit: unit,
        workTimes: workTimes
      });
  
      const timeRange = timeRangeEntity.calculateTimeRange();
      expect(timeRange.start.format('YYYY-MM-DD HH:mm:ss')).toBe('2023-03-02 08:30:00');
      expect(timeRange.end.format('YYYY-MM-DD HH:mm:ss')).toBe('2023-03-02 09:30:00');
    });
  });

  describe('贪婪模式', () => {
    const duration = 3600;
    const unit = 'second';
    const step = 1;
    const workTimes = [
      {
        start: '2023-03-02 00:00:00',
        end: '2023-03-02 08:00:00' 
      },
      {
        start: '2023-03-02 08:30:00',
        end: '2023-03-03 02:00:00'
      },
      {
        start: '2023-03-03 08:30:00',
        end: '2023-03-04 02:00:00'
      }
    ];

    test('测试结束时间命中到休息日的开始时间，结束时间为休息时间的结束时间', () => {
      const startDate = '2023-03-02 07:00:00';
      const timeRangeEntity = new TimeRange({
        startDate: startDate,
        duration: duration,
        step: step,
        unit: unit,
        workTimes: workTimes
      });
  
      const timeRange = timeRangeEntity.calculateTimeRange({ greed: true });
      expect(timeRange.start.format('YYYY-MM-DD HH:mm:ss')).toBe('2023-03-02 07:00:00');
      expect(timeRange.end.format('YYYY-MM-DD HH:mm:ss')).toBe('2023-03-02 08:30:00');

      // expect(timeRangeEntity.holidayTimeList.length).toBe(1);
      // expect(timeRangeEntity.holidayTimeList[0].isEdge).toBe(true);

    });

    test('测试开始时间为班次结束时间', () => {
      const startDate = '2023-03-02 08:00:00';
      const timeRangeEntity = new TimeRange({
        startDate: startDate,
        duration: duration,
        step: step,
        unit: unit,
        workTimes: workTimes
      });
  
      const timeRange = timeRangeEntity.calculateTimeRange({ greed: true });
      expect(timeRange.start.format('YYYY-MM-DD HH:mm:ss')).toBe('2023-03-02 08:00:00');
      expect(timeRange.end.format('YYYY-MM-DD HH:mm:ss')).toBe('2023-03-02 09:30:00');

      // expect(timeRangeEntity.holidayTimeList.length).toBe(1);
      // expect(timeRangeEntity.holidayTimeList[0].isEdge).toBe(true);
    });

    test('测试开始时间为班次结束时间', () => {
      const startDate = '2023-03-02 08:00:00';
      const timeRangeEntity = new TimeRange({
        startDate: startDate,
        duration: 24 * 3600,
        step: step,
        unit: unit,
        workTimes: workTimes
      });
  
      const timeRange = timeRangeEntity.calculateTimeRange({ greed: true });
      expect(timeRange.start.format('YYYY-MM-DD HH:mm:ss')).toBe('2023-03-02 08:00:00');
      expect(timeRange.end.format('YYYY-MM-DD HH:mm:ss')).toBe('2023-03-03 15:00:00');

      // expect(timeRangeEntity.holidayTimeList.length).toBe(2);
      // expect(timeRangeEntity.holidayTimeList[0].isEdge).toBe(true);
      // expect(timeRangeEntity.holidayTimeList[1].isEdge).toBe(false);
    });
  });
});