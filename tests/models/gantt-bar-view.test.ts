import { SchedulingMode } from '@/types/gantt-config';
import { GanttBars } from '@/models/gantt-bars';
import { GanttBus } from '@/models/gantt-bus';
import { GanttConfig } from '@/models/gantt-config';
import { GanttGroups } from '@/models/gantt-groups';
import { GanttLayoutConfig } from '@/models/gantt-layout-config';

describe('gantt-bar-view 计算属性', () => {
  // #region 测试数据
  const layoutConfig = new GanttLayoutConfig({ });
  const config = new GanttConfig({
    endDate: '2025-01-30',
    layoutConfig,
    startDate: '2025-01-01',
    draggable: true,
    selectable: true,
    contextMenuEnable: true
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
    group: groups.getById(1)!,
    duration: 2 * 24 * 60 * 60,
    start: '2025-01-01 00:00:00',
    end: '2025-01-03 00:00:00',
    groups
  });
  
  bars.add({
    bars,
    bus,
    config,
    layoutConfig,
    id: 2,
    group: groups.getById(1)!,
    duration: 2 * 24 * 60 * 60,
    start: '2025-01-02 00:00:00',
    end: '2025-01-04 00:00:00',
    groups
  });
  
  bars.add({
    bars,
    bus,
    config,
    layoutConfig,
    id: 3,
    group: groups.getById(1)!,
    duration: 2 * 24 * 60 * 60,
    start: '2025-01-08 00:00:00',
    end: '2025-01-10 00:00:00',
    groups
  });

  groups.calculateExpandedGroups();
  // #endregion

  test('draggable', () => {
    const bar = bars.getById(1)!;

    config.draggable = true;
    bar.draggable = undefined;
    expect(bar.draggable).toBe(true);
    bar.draggable = false;
    expect(bar.draggable).toBe(false);
    expect(config.draggable).toBe(true);
    bar.draggable = true;
    expect(bar.draggable).toBe(true);

    config.draggable = false;
    bar.draggable = undefined;
    expect(bar.draggable).toBe(false);
    bar.draggable = false;
    expect(bar.draggable).toBe(false);
    expect(config.draggable).toBe(false);
    bar.draggable = true;
    expect(bar.draggable).toBe(false);

    bar.draggable = undefined;
  });

  test('selectable', () => {
    const bar = bars.getById(1)!;
    bar.selectable = undefined;
    expect(bar.selectable).toBe(true);
    bar.selectable = false;
    expect(bar.selectable).toBe(false);
    expect(config.selectable).toBe(true);
    bar.selectable = true;
    expect(bar.selectable).toBe(true);
    bar.selectable = undefined;
  });

  test('contextMenuEnable', () => {
    const bar = bars.getById(1)!;
    bar.contextMenuEnable = undefined;
    expect(bar.contextMenuEnable).toBe(true);
    bar.contextMenuEnable = false;
    expect(bar.contextMenuEnable).toBe(false);
    expect(config.contextMenuEnable).toBe(true);
    bar.contextMenuEnable = true;
    expect(bar.contextMenuEnable).toBe(true);
    bar.contextMenuEnable = undefined;
  });

  test('selected selectable true', () => {
    const bar = bars.getById(1)!;
    config.selectable = true;
    bar.selectable = true;

    expect(bar.selected).toBe(false);
    bar.selected = true;
    expect(bar.selected).toBe(true);
    expect(bars.selectedBars.has(bar.id)).toBe(true);

    bar.selected = false;
    expect(bar.selected).toBe(false);
    expect(bars.selectedBars.has(bar.id)).toBe(false);
  });

  test('group', () => {
    const bar = bars.getById(1)!;
    const group1 = groups.getById(1)!;
    const group2 = groups.getById(2)!;

    expect(bar.group).toBe(group1);
    expect(group1.bars.has(bar.id)).toBe(true);
    bar.group = group2;
    expect(bar.group).toBe(group2);
    expect(group1.bars.has(bar.id)).toBe(false);
    expect(group2.bars.has(bar.id)).toBe(true);
    bar.group = group1;
  });

  test('isRectanglesOverlap', () => {
    const bar = bars.getById(1)!;
    expect(bar.isRectanglesOverlap({
      x1: 10,
      x2: 20 
    }, {
      x1: 11,
      x2: 12 
    })).toBe(true);

    expect(bar.isRectanglesOverlap({
      x1: 10,
      x2: 20 
    }, {
      x1: 9,
      x2: 12 
    })).toBe(true);

    expect(bar.isRectanglesOverlap({
      x1: 10,
      x2: 20 
    }, {
      x1: 11,
      x2: 21 
    })).toBe(true);

    expect(bar.isRectanglesOverlap({
      x1: 10,
      x2: 20 
    }, {
      x1: 9,
      x2: 21
    })).toBe(true);

    expect(bar.isRectanglesOverlap({
      x1: 10,
      x2: 20 
    }, {
      x1: 20,
      x2: 21 
    })).toBe(false);
    
    expect(bar.isRectanglesOverlap({
      x1: 10,
      x2: 20 
    }, {
      x1: 0,
      x2: 2 
    })).toBe(false);
  });

  test('calculatePosX', () => {
    const bar = bars.getById(1)!;
    bar.resetTimeRange();
    bar.calculatePosX();

    expect(bar.sx).toBe(0);
    expect(bar.ex).toBeCloseTo(400);
    expect(bar.width).toBeCloseTo(400);
  });

  test('calculatePosY', () => {
    const bar = bars.getById(1)!;
    bar.resetTimeRange();
    bar.calculatePosY();
    expect(bar.sy).toBe(25);
    expect(bar.ey).toBe(55);
    expect(bar.height).toBe(30);
  });

  test('calculateOverlapBarIds', () => {
    const bar1 = bars.getById(1)!;
    const bar2 = bars.getById(2)!;
    const bar3 = bars.getById(3)!;
    const group1 = groups.getById(1)!;
    expect(bar1.group.id).toBe(bar2.group.id);
    bar1.resetTimeRange();
    bar2.resetTimeRange();
    bar3.resetTimeRange();
    
    expect(group1.dayBarMap['2025-01-01']?.has(bar1.id)).toBe(true);
    expect(group1.dayBarMap['2025-01-01']?.has(bar2.id)).toBe(false);
    expect(group1.dayBarMap['2025-01-02']?.has(bar1.id)).toBe(true);
    expect(group1.dayBarMap['2025-01-02']?.has(bar2.id)).toBe(true);
    expect(group1.dayBarMap['2025-01-03']?.has(bar1.id)).toBe(true);
    expect(group1.dayBarMap['2025-01-03']?.has(bar2.id)).toBe(true);
    expect(group1.dayBarMap['2025-01-04']?.has(bar1.id)).toBe(false);
    expect(group1.dayBarMap['2025-01-04']?.has(bar2.id)).toBe(true);

    bar1.clearOverlap();
    bar1.calculateOverlapBarIds();

    bar2.clearOverlap();
    bar2.calculateOverlapBarIds();

    bar3.clearOverlap();
    bar3.calculateOverlapBarIds();
    expect(bar1.overlapBarIds).toEqual([2]);
    expect(bar2.overlapBarIds).toEqual([1]);
    expect(bar3.overlapBarIds).toEqual([]);

    bar1.clearOverlap();
    expect(bar1.overlapBarIds).toEqual([]);
    expect(bar2.overlapBarIds.includes(bar1.id)).toEqual(false);
  });

  test('updateInfo', () => {
    const bar1 = bars.getById(1)!;
    const group2 = groups.getById(2)!;
    bar1.updateInfo({
      draggable: false,
      duration: 3 * 24 * 60 * 60,
      start: '2025-01-15 00:00:00',
      groupId: 2,
      end: '2025-01-15 00:00:00',
      schedulingMode: SchedulingMode.BACKWARD,
      selectable: false,
      rowIndex: 0
    });

    expect(bar1.draggable).toBe(false);
    expect(bar1.selectable).toBe(false);
    expect(bar1.duration).toBe(3 * 24 * 60 * 60);
    expect(bar1.group.id).toBe(2);
    expect(group2.bars.has(bar1.id)).toBe(true);
    expect(bar1.schedulingMode).toBe(SchedulingMode.BACKWARD);
    expect(bar1.end).toBe('2025-01-15 00:00:00');
    expect(bar1.start).toBe('2025-01-12 00:00:00');
  });
});