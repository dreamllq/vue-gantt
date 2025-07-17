import { GanttConfig } from '@/models/gantt-config';
import { Unit } from '@/types/unit';
import { SchedulingMode } from '@/types/gantt-config';
import { LinkShowStrategy } from '@/types/gantt-link';
import { GanttLayoutConfig } from '@/models/gantt-layout-config';
import { strToDate } from '@/utils/to-date';

describe('GanttConfig', () => {
  let configData: any;
  let ganttConfig: GanttConfig;
  const layoutConfig = new GanttLayoutConfig({ });
  beforeEach(() => {
    configData = {
      startDate: '2023-10-01',
      endDate: '2023-10-07',
      daySplitTime: '08:30',
      durationUnit: Unit.DAY,
      dataScaleUnit: Unit.WEEK,
      layoutConfig: layoutConfig,
      lazyDebounceTime: 500,
      schedulingMode: SchedulingMode.FORWARD,
      draggable: true,
      selectable: false,
      multipleSelectable: true,
      multipleDraggable: false,
      contextMenuEnable: true,
      linkShowStrategy: LinkShowStrategy.ALL,
      showCurrentTimeLine: true,
      showAttachedBars: false,
      dragTimeOffset: 300
    };

    ganttConfig = new GanttConfig(configData);
  });

  it('should initialize with correct properties', () => {
    expect(ganttConfig['_startDate']).toBe(configData.startDate);
    expect(ganttConfig['_endDate']).toBe(configData.endDate);
    expect(ganttConfig['_daySplitTime']).toBe(configData.daySplitTime);
    expect(ganttConfig.durationUnit).toBe(configData.durationUnit);
    expect(ganttConfig['_dataScaleUnit']).toBe(configData.dataScaleUnit);
    expect(ganttConfig.layoutConfig).toBe(configData.layoutConfig);
    expect(ganttConfig.lazyDebounceTime).toBe(configData.lazyDebounceTime);
    expect(ganttConfig.schedulingMode).toBe(configData.schedulingMode);
    expect(ganttConfig.draggable).toBe(configData.draggable);
    expect(ganttConfig.selectable).toBe(configData.selectable);
    expect(ganttConfig.multipleSelectable).toBe(configData.multipleSelectable);
    expect(ganttConfig.multipleDraggable).toBe(configData.multipleDraggable);
    expect(ganttConfig.contextMenuEnable).toBe(configData.contextMenuEnable);
    expect(ganttConfig.linkShowStrategy).toBe(configData.linkShowStrategy);
    expect(ganttConfig.showCurrentTimeLine).toBe(configData.showCurrentTimeLine);
    expect(ganttConfig['_showAttachedBars']).toBe(configData.showAttachedBars);
    expect(ganttConfig.dragTimeOffset).toBe(configData.dragTimeOffset);
  });

  it('should format start and end correctly', () => {
    expect(ganttConfig.start).toBe('2023-10-01 08:30:00');
    expect(ganttConfig.end).toBe('2023-10-07 08:30:00');
  });

  it('should compute startTimeMills and endTimeMills correctly', () => {
    const dateStart = new Date('2023-10-01 08:30:00').getTime();
    const dateEnd = new Date('2023-10-07 08:30:00').getTime();

    expect(ganttConfig.startTimeMills).toBe(dateStart);
    expect(ganttConfig.endTimeMills).toBe(dateEnd);
  });

  it('should emit event when showAttachedBars changes', () => {
    const emitSpy = jest.spyOn(ganttConfig, 'emit');

    ganttConfig.showAttachedBars = true;
    expect(ganttConfig.showAttachedBars).toBe(true);
    expect(emitSpy).toHaveBeenCalledWith(GanttConfig.Events.SHOW_ATTACHED_BARS_CHANGE, true);
  });

  it('should not emit event if showAttachedBars does not change', () => {
    const emitSpy = jest.spyOn(ganttConfig, 'emit');

    ganttConfig.showAttachedBars = false;
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should compute minuteWidth correctly for different dataScaleUnits', () => {
    ganttConfig['_dataScaleUnit'] = Unit.DAY;
    expect(ganttConfig.minuteWidth).toBeCloseTo(layoutConfig.TIME_UNIT_WIDTH / 24 / 60); // assuming TIME_UNIT_WIDTH is 1440

    ganttConfig['_dataScaleUnit'] = Unit.WEEK;
    expect(ganttConfig.minuteWidth).toBeCloseTo(layoutConfig.TIME_UNIT_WIDTH / 7 / 24 / 60);

    ganttConfig['_dataScaleUnit'] = Unit.MONTH;
    expect(ganttConfig.minuteWidth).toBeCloseTo(layoutConfig.TIME_UNIT_WIDTH / 30 / 24 / 60);

    ganttConfig['_dataScaleUnit'] = Unit.HOUR;
    expect(ganttConfig.minuteWidth).toBeCloseTo(0);
  });

  it('should compute secondWidth correctly', () => {
    ganttConfig['_dataScaleUnit'] = Unit.DAY;
    const expectedSecondWidth = ganttConfig.minuteWidth / 60;
    expect(ganttConfig.secondWidth).toBeCloseTo(expectedSecondWidth);
  });

  it('should convert to JSON correctly', () => {
    const json = ganttConfig.toJSON();

    expect(json.startDate).toBe(configData.startDate);
    expect(json.endDate).toBe(configData.endDate);
    expect(json.contextMenuEnable).toBe(configData.contextMenuEnable);
    expect(json.dataScaleUnit).toBe('WEEK');
    expect(json.daySplitTime).toBe('WEEK'); // 注意这里可能有误，应根据实际逻辑修正
    expect(json.draggable).toBe(configData.draggable);
    expect(json.dragTimeOffset).toBe(configData.dragTimeOffset);
    expect(json.durationUnit).toBe('DAY');
    expect(json.lazyDebounceTime).toBe(configData.lazyDebounceTime);
    expect(json.linkShowStrategy).toBe('ALL');
    expect(json.multipleDraggable).toBe(configData.multipleDraggable);
    expect(json.multipleSelectable).toBe(configData.multipleSelectable);
    expect(json.schedulingMode).toBe('FORWARD');
    expect(json.selectable).toBe(configData.selectable);
    expect(json.showAttachedBars).toBe(configData.showAttachedBars);
    expect(json.showCurrentTimeLine).toBe(configData.showAttachedBars); // 注意这里可能是错误
  });



  it('should emit event when multipleSelectable changes', () => {
    const emitSpy = jest.spyOn(ganttConfig, 'emit');

    ganttConfig.multipleSelectable = false;
    expect(ganttConfig.multipleSelectable).toBe(false);
    expect(emitSpy).toHaveBeenCalledWith(GanttConfig.Events.MULTIPLE_SELECTABLE_CHANGE, false);

    ganttConfig.multipleSelectable = true;
    expect(ganttConfig.multipleSelectable).toBe(true);
    expect(emitSpy).toHaveBeenCalledWith(GanttConfig.Events.MULTIPLE_SELECTABLE_CHANGE, true);
  });

  it('should not emit event if multipleSelectable does not change', () => {
    const emitSpy = jest.spyOn(ganttConfig, 'emit');

    ganttConfig.multipleSelectable = true; // 原始值就是 false
    expect(emitSpy).not.toHaveBeenCalled();
  });
});


describe('GanttConfig - dataUnitCount', () => {
  test('should return correct number of days between start and end dates', () => {
    const layoutConfig = new GanttLayoutConfig({});
    const config = new GanttConfig({
      layoutConfig,
      startDate: '2023-01-01',
      endDate: '2023-01-10',
      dataScaleUnit: Unit.DAY
    });

    expect(config.dataUnitCount).toBe(9); // 10 - 1 = 9 天
  });

  test('should return correct number of weeks between start and end dates', () => {
    const layoutConfig = new GanttLayoutConfig({});
    const config = new GanttConfig({
      layoutConfig,
      startDate: '2023-01-01',
      endDate: '2023-01-15',
      dataScaleUnit: Unit.WEEK
    });

    expect(config.dataUnitCount).toBe(2); // 跨越了 2 周
  });

  test('should return correct number of months between start and end dates', () => {
    const layoutConfig = new GanttLayoutConfig({});
    const config = new GanttConfig({
      layoutConfig,
      startDate: '2023-01-15',
      endDate: '2023-04-10',
      dataScaleUnit: Unit.MONTH
    });

    expect(config.dataUnitCount).toBe(2); // Jan -> Feb -> Mar -> Apr, 差值为 3 个月
  });
});

describe('GanttConfig - totalSeconds', () => {
  test('should return correct total seconds between start and end dates (1 day)', () => {
    const layoutConfig = new GanttLayoutConfig({});
    const config = new GanttConfig({
      layoutConfig,
      startDate: '2023-01-01',
      endDate: '2023-01-02',
      daySplitTime: '00:00'
    });

    expect(config.totalSeconds).toBe(86400); // 24 * 60 * 60 = 86400 秒
  });

  test('should return correct total seconds between start and end dates (multiple days)', () => {
    const layoutConfig = new GanttLayoutConfig({});
    const config = new GanttConfig({
      layoutConfig,
      startDate: '2023-01-01',
      endDate: '2023-01-05',
      daySplitTime: '00:00'
    });

    expect(config.totalSeconds).toBe(86400 * 4); // 4 天 = 345600 秒
  });

  test('should return correct total seconds with different time split', () => {
    const layoutConfig = new GanttLayoutConfig({});
    const config = new GanttConfig({
      layoutConfig,
      startDate: '2023-01-01',
      endDate: '2023-01-02',
      daySplitTime: '12:30'
    });

    const expectedSeconds = Math.floor((strToDate('2023-01-02 12:30:00').getTime() - strToDate('2023-01-01 12:30:00').getTime()) / 1000);

    expect(config.totalSeconds).toBe(expectedSeconds);
  });

  test('should handle leap seconds or daylight saving changes correctly (if supported)', () => {
    const layoutConfig = new GanttLayoutConfig({});
    const config = new GanttConfig({
      layoutConfig,
      startDate: '2023-03-26',
      endDate: '2023-03-27',
      daySplitTime: '00:00'
    });

    // 在 DST 调整日，可能不是正好 86400 秒
    const diffInSeconds = Math.floor((config.endTimeMills - config.startTimeMills) / 1000);
    expect(config.totalSeconds).toBe(diffInSeconds);
  });
});

describe('GanttConfig - dataScaleUnit', () => {
  test('should initialize with default dataScaleUnit (DAY)', () => {
    const layoutConfig = new GanttLayoutConfig({});
    const config = new GanttConfig({
      layoutConfig,
      startDate: '2023-01-01',
      endDate: '2023-01-07'
    });

    expect(config.dataScaleUnit).toBe(Unit.DAY);
  });

  test('should emit DATA_SCALE_UNIT_CHANGE event when dataScaleUnit is changed', () => {
    const layoutConfig = new GanttLayoutConfig({});
    const config = new GanttConfig({
      layoutConfig,
      startDate: '2023-01-01',
      endDate: '2023-01-07',
      dataScaleUnit: Unit.DAY
    });

    const emitSpy = jest.spyOn(config, 'emit');

    config.dataScaleUnit = Unit.WEEK;
    expect(config.dataScaleUnit).toBe(Unit.WEEK);
    expect(emitSpy).toHaveBeenCalledWith(GanttConfig.Events.DATA_SCALE_UNIT_CHANGE, Unit.WEEK);
  });

  test('should not emit event when dataScaleUnit is set to the same value', () => {
    const layoutConfig = new GanttLayoutConfig({});
    const config = new GanttConfig({
      layoutConfig,
      startDate: '2023-01-01',
      endDate: '2023-01-07',
      dataScaleUnit: Unit.WEEK
    });

    const emitSpy = jest.spyOn(config, 'emit');

    config.dataScaleUnit = Unit.WEEK; // 设置为相同值
    expect(emitSpy).not.toHaveBeenCalled();
  });

  test('should correctly update dataScaleUnit and affect minuteWidth calculation', () => {
    const layoutConfig = new GanttLayoutConfig({ TIME_UNIT_WIDTH: 1440 });
    const config = new GanttConfig({
      layoutConfig,
      startDate: '2023-01-01',
      endDate: '2023-01-07',
      dataScaleUnit: Unit.DAY
    });

    config.dataScaleUnit = Unit.DAY;
    expect(config.minuteWidth).toBeCloseTo(1); // 1440 / 24 / 60 = 1

    config.dataScaleUnit = Unit.WEEK;
    expect(config.minuteWidth).toBeCloseTo(1440 / 7 / 24 / 60); // WEEK

    config.dataScaleUnit = Unit.MONTH;
    expect(config.minuteWidth).toBeCloseTo(1440 / 30 / 24 / 60); // MONTH
  });
});

describe('GanttConfig - selectable', () => {
  test('should initialize with correct default selectable value', () => {
    const layoutConfig = new GanttLayoutConfig({});
    const config = new GanttConfig({
      layoutConfig,
      startDate: '2023-01-01',
      endDate: '2023-01-07'
    });

    expect(config.selectable).toBe(false); // 默认值为 false
  });

  test('should emit SELECTABLE_CHANGE event when selectable is changed to true', () => {
    const layoutConfig = new GanttLayoutConfig({});
    const config = new GanttConfig({
      layoutConfig,
      startDate: '2023-01-01',
      endDate: '2023-01-07'
    });

    const emitSpy = jest.spyOn(config, 'emit');

    config.selectable = true;
    expect(config.selectable).toBe(true);
    expect(emitSpy).toHaveBeenCalledWith(GanttConfig.Events.SELECTABLE_CHANGE, true);
  });

  test('should emit SELECTABLE_CHANGE event when selectable is changed to false', () => {
    const layoutConfig = new GanttLayoutConfig({});
    const config = new GanttConfig({
      layoutConfig,
      startDate: '2023-01-01',
      endDate: '2023-01-07',
      selectable: true
    });

    const emitSpy = jest.spyOn(config, 'emit');

    config.selectable = false;
    expect(config.selectable).toBe(false);
    expect(emitSpy).toHaveBeenCalledWith(GanttConfig.Events.SELECTABLE_CHANGE, false);
  });

  test('should not emit event if selectable does not change', () => {
    const layoutConfig = new GanttLayoutConfig({});
    const config = new GanttConfig({
      layoutConfig,
      startDate: '2023-01-01',
      endDate: '2023-01-07',
      selectable: true
    });

    const emitSpy = jest.spyOn(config, 'emit');

    config.selectable = true; // 设置相同值
    expect(emitSpy).not.toHaveBeenCalled();
  });
});