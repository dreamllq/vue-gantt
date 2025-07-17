import { SchedulingMode } from '@/types/gantt-config';
import { GanttBars } from '@/models/gantt-bars';
import { GanttBus } from '@/models/gantt-bus';
import { GanttConfig } from '@/models/gantt-config';
import { GanttGroup } from '@/models/gantt-group';

import { GanttGroups } from '@/models/gantt-groups';
import { GanttLayoutConfig } from '@/models/gantt-layout-config';
import { GanttWorkTimes } from '@/models/gantt-work-times';

describe('gantt-bar 计算属性', () => {
  const layoutConfig = new GanttLayoutConfig({ });
  const config = new GanttConfig({
    endDate: '',
    layoutConfig,
    startDate: ''
  });
  const bus = new GanttBus();
  const groups = new GanttGroups({
    bus,
    config,
    layoutConfig
  });
  groups.add({
    bus,
    config,
    layoutConfig,
    id: 1
  });
  groups.add({
    bus,
    config,
    layoutConfig,
    id: 2
  });
  const bars = new GanttBars({
    config,
    layoutConfig,
    bus,
    groups
  });

  bars.add({
    bars,
    bus,
    config,
    layoutConfig,
    id: 1,
    group: groups.getById(1) as GanttGroup,
    duration: 100,
    start: '2025-01-01 00:00:00',
    end: '2025-01-03 00:00:00',
    groups
  });

  test('calculateTimeRange', () => {
    const gb = bars.getById(1)!;
    gb.calculateTimeRange();
    expect(gb.start).toBe('2025-01-01 00:00:00');
    expect(gb.end).toBe('2025-01-03 00:00:00');
  });

  test('schedulingMode', () => {
    const gb = bars.getById(1)!;
    gb.schedulingMode = undefined;
    expect(gb.schedulingMode).toBe(SchedulingMode.FORWARD);
    gb.schedulingMode = SchedulingMode.BACKWARD;
    expect(gb.schedulingMode).toBe(SchedulingMode.BACKWARD);
    gb.schedulingMode = SchedulingMode.FORWARD;
    expect(gb.schedulingMode).toBe(SchedulingMode.FORWARD);
  });
});

describe('gantt-bar 时间计算 正排', () => {
  const layoutConfig = new GanttLayoutConfig({ });
  const config = new GanttConfig({
    endDate: '2025-01-30',
    layoutConfig,
    startDate: '2025-01-01'
  });
  const bus = new GanttBus();
  test('base', () => {
    const groups = new GanttGroups({
      bus,
      config,
      layoutConfig
    });
    groups.add({
      bus,
      config,
      layoutConfig,
      id: 1
    });
    const bars = new GanttBars({
      config,
      layoutConfig,
      bus,
      groups
    });

    bars.add({
      bars,
      bus,
      config,
      layoutConfig,
      id: 1,
      group: groups.getById(1) as GanttGroup,
      duration: 100,
      start: '2025-01-01 00:00:00',
      end: null,
      groups
    });
    const gb = bars.getById(1)!;
    gb.calculateTimeRange();

    expect(gb.end).toBe('2025-01-01 00:01:40');

    gb.start = '2024-01-01 00:00:00';
    gb.calculateTimeRange();
    expect(gb.start).toBe('2025-01-01 00:00:00');
    expect(gb.end).toBe('2025-01-01 00:01:40');

  });

  test('有休息日-开始时间在休息时间', () => {
    const groups = new GanttGroups({
      bus,
      config,
      layoutConfig
    });
    const ggwts = new GanttWorkTimes({
      bus,
      config,
      groups
    });
    groups.add({
      bus,
      config,
      layoutConfig,
      id: 1
    });

    ggwts.add({
      config,
      start: '2025-01-01 01:00:00',
      end: '2025-01-01 02:00:00',
      group: groups.getById(1)!,
      groups,
      id: 1,
      layoutConfig
    });
    const bars = new GanttBars({
      config,
      layoutConfig,
      bus,
      groups
    });

    bars.add({
      bars,
      bus,
      config,
      layoutConfig,
      id: 1,
      group: groups.getById(1) as GanttGroup,
      duration: 100,
      start: '2025-01-01 00:00:00',
      end: null,
      groups
    });
    const gb = bars.getById(1)!;
    gb.calculateTimeRange();

    expect(gb.end).toBe('2025-01-01 01:01:40');
    expect(gb.start).toBe('2025-01-01 01:00:00');
  });

  test('有休息日-开始时间在工作时间', () => {
    const groups = new GanttGroups({
      bus,
      config,
      layoutConfig
    });
    groups.add({
      bus,
      config,
      layoutConfig,
      id: 1
    });
    const ggwts = new GanttWorkTimes({
      bus,
      config,
      groups
    });
    ggwts.add({
      start: '2025-01-01 01:00:00',
      end: '2025-01-01 02:00:00',
      config,
      group: groups.getById(1)!,
      groups,
      id: 1,
      layoutConfig
    });
    const bars = new GanttBars({
      config,
      layoutConfig,
      bus,
      groups
    });

    bars.add({
      bars,
      bus,
      config,
      layoutConfig,
      id: 1,
      group: groups.getById(1) as GanttGroup,
      duration: 100,
      start: '2025-01-01 01:01:00',
      end: null,
      groups
    });
    const gb = bars.getById(1)!;
    gb.calculateTimeRange();

    expect(gb.end).toBe('2025-01-01 01:02:40');
    expect(gb.start).toBe('2025-01-01 01:01:00');
  });

  test('计算结束时间在总体结束时间之后', () => { 
    const groups = new GanttGroups({
      bus,
      config,
      layoutConfig
    });
    groups.add({
      bus,
      config,
      layoutConfig,
      id: 1
    });
    const bars = new GanttBars({
      config,
      layoutConfig,
      bus,
      groups
    });

    bars.add({
      bars,
      bus,
      config,
      layoutConfig,
      id: 1,
      group: groups.getById(1) as GanttGroup,
      duration: 100,
      start: '2025-01-29 23:59:00',
      end: null,
      groups
    });
    const gb = bars.getById(1)!;
    gb.calculateTimeRange();

    expect(gb.end).toBe('2025-01-30 00:00:00');
    expect(gb.start).toBe('2025-01-29 23:58:20');
  });
});


describe('gantt-bar 时间计算 倒排', () => {
  const layoutConfig = new GanttLayoutConfig({ });
  const config = new GanttConfig({
    endDate: '2025-01-30',
    layoutConfig,
    startDate: '2025-01-01'
  });
  const bus = new GanttBus();
  test('base', () => {
    const groups = new GanttGroups({
      bus,
      config,
      layoutConfig
    });
    groups.add({
      bus,
      config,
      layoutConfig,
      id: 1
    });
    const bars = new GanttBars({
      config,
      layoutConfig,
      bus,
      groups
    });

    bars.add({
      bars,
      bus,
      config,
      layoutConfig,
      id: 1,
      group: groups.getById(1) as GanttGroup,
      duration: 100,
      start: null,
      end: '2025-01-02 00:00:00',
      groups,
      schedulingMode: SchedulingMode.BACKWARD
    });
    const gb = bars.getById(1)!;
    gb.calculateTimeRange();

    expect(gb.start).toBe('2025-01-01 23:58:20');

    gb.end = '2025-02-01 00:00:00';
    gb.calculateTimeRange();
    expect(gb.start).toBe('2025-01-29 23:58:20');
    expect(gb.end).toBe('2025-01-30 00:00:00');
  });

  test('有休息日- 结束时间在休息时间', () => {
    const groups = new GanttGroups({
      bus,
      config,
      layoutConfig
    });
    const ggwts = new GanttWorkTimes({
      bus,
      config,
      groups
    });
    groups.add({
      bus,
      config,
      layoutConfig,
      id: 1
    });

    ggwts.add({
      config,
      start: '2025-01-01 01:00:00',
      end: '2025-01-01 02:00:00',
      group: groups.getById(1)!,
      groups,
      id: 1,
      layoutConfig
    });
    const bars = new GanttBars({
      config,
      layoutConfig,
      bus,
      groups
    });

    bars.add({
      bars,
      bus,
      config,
      layoutConfig,
      id: 1,
      group: groups.getById(1) as GanttGroup,
      duration: 100,
      start: null,
      end: '2025-01-01 03:00:00',
      groups,
      schedulingMode: SchedulingMode.BACKWARD
    });
    const gb = bars.getById(1)!;
    gb.calculateTimeRange();

    expect(gb.end).toBe('2025-01-01 02:00:00');
    expect(gb.start).toBe('2025-01-01 01:58:20');
  });

  test('有休息日-结束时间在工作时间', () => {
    const groups = new GanttGroups({
      bus,
      config,
      layoutConfig
    });
    groups.add({
      bus,
      config,
      layoutConfig,
      id: 1
    });
    const ggwts = new GanttWorkTimes({
      bus,
      config,
      groups
    });
    ggwts.add({
      start: '2025-01-01 01:00:00',
      end: '2025-01-01 02:00:00',
      config,
      group: groups.getById(1)!,
      groups,
      id: 1,
      layoutConfig
    });
    const bars = new GanttBars({
      config,
      layoutConfig,
      bus,
      groups
    });

    bars.add({
      bars,
      bus,
      config,
      layoutConfig,
      id: 1,
      group: groups.getById(1) as GanttGroup,
      duration: 100,
      start: null,
      end: '2025-01-01 01:59:00',
      groups,
      schedulingMode: SchedulingMode.BACKWARD
    });
    const gb = bars.getById(1)!;
    gb.calculateTimeRange();

    expect(gb.end).toBe('2025-01-01 01:59:00');
    expect(gb.start).toBe('2025-01-01 01:57:20');
  });
  test('计算开始时间在总体开始时间之前', () => {
    const groups = new GanttGroups({
      bus,
      config,
      layoutConfig
    });
    groups.add({
      bus,
      config,
      layoutConfig,
      id: 1
    });
    const bars = new GanttBars({
      config,
      layoutConfig,
      bus,
      groups
    });

    bars.add({
      bars,
      bus,
      config,
      layoutConfig,
      id: 1,
      group: groups.getById(1) as GanttGroup,
      duration: 100,
      start: null,
      end: '2025-01-01 00:01:00',
      groups,
      schedulingMode: SchedulingMode.BACKWARD
    });
    const gb = bars.getById(1)!;
    gb.calculateTimeRange();

    expect(gb.start).toBe('2025-01-01 00:00:00');
    expect(gb.end).toBe('2025-01-01 00:01:40');
  });
});

describe('gantt-bar calculateDayList', () => {
  const layoutConfig = new GanttLayoutConfig({ });
  const config = new GanttConfig({
    endDate: '',
    layoutConfig,
    startDate: ''
  });
  const bus = new GanttBus();
  const groups = new GanttGroups({
    bus,
    config,
    layoutConfig
  });
  groups.add({
    bus,
    config,
    layoutConfig,
    id: 1
  });
  groups.add({
    bus,
    config,
    layoutConfig,
    id: 2
  });
  const bars = new GanttBars({
    config,
    layoutConfig,
    bus,
    groups
  });

  bars.add({
    bars,
    bus,
    config,
    layoutConfig,
    id: 1,
    group: groups.getById(1) as GanttGroup,
    duration: 100,
    start: '2025-01-01 00:00:00',
    end: '2025-01-03 00:00:00',
    groups,
    schedulingMode: SchedulingMode.BACKWARD
  });

  test('初始化', () => {
    const gb = bars.getById(1)!;
    gb.calculateDayList();
    expect(gb.dayList).toEqual([
      '2025-01-01',
      '2025-01-02',
      '2025-01-03'
    ]);
    expect(gb.group.dayBarMap['2025-01-01']!.has(1)).toBe(true);
    expect(gb.group.dayBarMap['2025-01-02']!.has(1)).toBe(true);
    expect(gb.group.dayBarMap['2025-01-03']!.has(1)).toBe(true);
    expect(gb.group.dayBarMap['2025-01-04']?.has(1)).toBe(undefined);
  });

  test('修改时间后计算', () => {
    const gb = bars.getById(1)!;
    gb.start = '2025-01-08 00:00:00';
    gb.end = '2025-01-10 00:00:00';
    gb.calculateDayList();

    expect(gb.dayList).toEqual([
      '2025-01-08',
      '2025-01-09',
      '2025-01-10'
    ]);

    expect(gb.group.dayBarMap['2025-01-01']!.has(1)).toBe(false);
    expect(gb.group.dayBarMap['2025-01-02']!.has(1)).toBe(false);
    expect(gb.group.dayBarMap['2025-01-03']!.has(1)).toBe(false);
    expect(gb.group.dayBarMap['2025-01-08']!.has(1)).toBe(true);
    expect(gb.group.dayBarMap['2025-01-09']!.has(1)).toBe(true);
    expect(gb.group.dayBarMap['2025-01-10']!.has(1)).toBe(true);
  });

  test('修改group', () => {
    const gb = bars.getById(1)!;
    const group1 = groups.getById(1)!;
    const group2 = groups.getById(2)!;

    gb.group = group2;

    expect(group1.dayBarMap['2025-01-08']!.has(1)).toBe(false);
    expect(group1.dayBarMap['2025-01-09']!.has(1)).toBe(false);
    expect(group1.dayBarMap['2025-01-10']!.has(1)).toBe(false);

    expect(group2.dayBarMap['2025-01-08']!.has(1)).toBe(true);
    expect(group2.dayBarMap['2025-01-09']!.has(1)).toBe(true);
    expect(group2.dayBarMap['2025-01-10']!.has(1)).toBe(true);
  });
});