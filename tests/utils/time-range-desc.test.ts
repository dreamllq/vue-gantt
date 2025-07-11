import { dateTimeFormat } from '@/utils/date-time-format';
import TimeRange from '@/utils/time-range/index.ts';

describe('time-range 倒序', () => {
  test('测试获取可用的时间周期-不涉及休息日', () => {
    const endDate = '2023-03-03 01:00:00';
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
      endDate: endDate,
      // desc: true,
      duration: duration,
      step: step,
      unit: unit,
      workTimes: workTimes
    });

    const timeRange = timeRangeEntity.calculateTimeRange();
    expect(dateTimeFormat(timeRange.start)).toBe('2023-03-02 23:00:00');
    expect(dateTimeFormat(timeRange.end)).toBe('2023-03-03 01:00:00');
  });
  test('测试获取可用的时间周期，结束时间在休息时段', () => {
    const endDate = '2023-03-02 08:20:00';
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
      endDate: endDate,
      // desc: true,
      duration: duration,
      step: step,
      unit: unit,
      workTimes: workTimes
    });

    const timeRange = timeRangeEntity.calculateTimeRange();
    expect(dateTimeFormat(timeRange.start)).toBe('2023-03-02 06:00:00');
    expect(dateTimeFormat(timeRange.end)).toBe('2023-03-02 08:00:00');
  });
  test('测试获取可用的时间周期，开始时间在休息时段', () => {
    const endDate = '2023-03-02 10:10:00';
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
      endDate: endDate,
      // desc: true,
      duration: duration,
      step: step,
      unit: unit,
      workTimes: workTimes
    });

    const timeRange = timeRangeEntity.calculateTimeRange();
    expect(dateTimeFormat(timeRange.start)).toBe('2023-03-02 07:40:00');
    expect(dateTimeFormat(timeRange.end)).toBe('2023-03-02 10:10:00');
  });
  test('测试获取可用的时间周期，开始时间跨越休息时段', () => {
    const endDate = '2023-03-02 09:00:00';
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
      endDate: endDate,
      // desc: true,
      duration: duration,
      step: step,
      unit: unit,
      workTimes: workTimes
    });

    const timeRange = timeRangeEntity.calculateTimeRange();
    expect(dateTimeFormat(timeRange.start)).toBe('2023-03-02 06:30:00');
    expect(dateTimeFormat(timeRange.end)).toBe('2023-03-02 09:00:00');
  }); 
  test('测试获取可用的时间周期，结束时间为休息日开始时间', () => {
    const endDate = '2023-03-02 08:30:00';
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
      endDate: endDate,
      // desc: true,
      duration: duration,
      step: step,
      unit: unit,
      workTimes: workTimes
    });

    const timeRange = timeRangeEntity.calculateTimeRange();
    expect(dateTimeFormat(timeRange.start)).toBe('2023-03-02 06:00:00');
    expect(dateTimeFormat(timeRange.end)).toBe('2023-03-02 08:00:00');
  });

  test('空时间 duration = 0', () => {
    const endDate = '2023-03-02 09:30:00';
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
      endDate: endDate,
      // desc: true,
      duration: duration,
      step: step,
      unit: unit,
      workTimes: workTimes
    });

    const timeRange = timeRangeEntity.calculateTimeRange();
    expect(dateTimeFormat(timeRange.start)).toBe('2023-03-02 09:30:00');
    expect(dateTimeFormat(timeRange.end)).toBe('2023-03-02 09:30:00');
  });

  test('多班次', () => {
    const endDate = '2023-03-03 11:00:00';
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
      endDate: endDate,
      // desc: true,
      duration: duration,
      step: step,
      unit: unit,
      workTimes: workTimes
    });

    const timeRange = timeRangeEntity.calculateTimeRange();
    expect(dateTimeFormat(timeRange.start)).toBe('2023-03-03 09:00:00');
    expect(dateTimeFormat(timeRange.end)).toBe('2023-03-03 11:00:00');
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
    test('测试开始时间命中到休息日的结束时间，开始时间为休息时间的结束时间', () => {
      const endDate = '2023-03-02 09:30:00';
      const timeRangeEntity = new TimeRange({
        endDate: endDate,
        // desc: true,
        duration: duration,
        step: step,
        unit: unit,
        workTimes: workTimes
      });
  
      const timeRange = timeRangeEntity.calculateTimeRange();
      expect(dateTimeFormat(timeRange.start)).toBe('2023-03-02 08:30:00');
      expect(dateTimeFormat(timeRange.end)).toBe('2023-03-02 09:30:00');
    });
    
    test('测试结束时间命中到休息日的结束时间，结束时间为休息日的开始时间', () => {
      const endDate = '2023-03-02 08:30:00';
      const timeRangeEntity = new TimeRange({
        endDate: endDate,
        // desc: true,
        duration: duration,
        step: step,
        unit: unit,
        workTimes: workTimes
      });
  
      const timeRange = timeRangeEntity.calculateTimeRange();
      expect(dateTimeFormat(timeRange.start)).toBe('2023-03-02 07:00:00');
      expect(dateTimeFormat(timeRange.end)).toBe('2023-03-02 08:00:00');
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
      }
    ];

    test('结束时间为工作日，开始时间为休息日结束时间', () => {
      const endDate = '2023-03-02 09:30:00';
      const timeRangeEntity = new TimeRange({
        endDate: endDate,
        // desc: true,
        duration: duration,
        step: step,
        unit: unit,
        workTimes: workTimes
      });
  
      const timeRange = timeRangeEntity.calculateTimeRange({ greed: true });
      expect(dateTimeFormat(timeRange.start)).toBe('2023-03-02 08:00:00');
      expect(dateTimeFormat(timeRange.end)).toBe('2023-03-02 09:30:00');
      // expect(timeRangeEntity.holidayTimeList.length).toBe(1);
      // expect(timeRangeEntity.holidayTimeList[0].isEdge).toBe(true);
    });
  });
});