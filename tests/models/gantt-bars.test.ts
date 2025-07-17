import { SchedulingMode } from '@/types/gantt-config';
import { GanttBars } from '@/models/gantt-bars';
import { GanttBus } from '@/models/gantt-bus';
import { GanttConfig } from '@/models/gantt-config';
import { GanttGroups } from '@/models/gantt-groups';
import { GanttLayoutConfig } from '@/models/gantt-layout-config';

describe('gantt-bars', () => {
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

  groups.calculateExpandedGroups();
  // #endregion

  test('add & removeById', () => {
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

    expect(bars.length).toBe(1);
    expect(groups.getById(1)!.bars.has(1)).toBe(true);
  
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
  
    expect(bars.length).toBe(2);
    expect(groups.getById(1)!.bars.has(2)).toBe(true);

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
    expect(bars.length).toBe(3);
    expect(groups.getById(1)!.bars.has(3)).toBe(true);

    bars.removeById(1);

    expect(bars.length).toBe(2);
    expect(groups.getById(1)!.bars.has(1)).toBe(false);

    const bar2 = bars.getById(2)!;
    bar2.selected = true;

    expect(bars.selectedBars.has(bar2.id)).toBe(true);

    bars.removeById(2);
    expect(bars.length).toBe(1);
    expect(groups.getById(1)!.bars.has(2)).toBe(false);
    expect(bars.selectedBars.has(bar2.id)).toBe(false);

    bars.removeById(3);
    expect(bars.length).toBe(0);
  });

  test('calculateGroupBarsRowIndex', () => {
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
    const bar1 = bars.getById(1)!;
    const bar2 = bars.getById(2)!;

    bar1.resetTimeRange();
    bar1.calculatePosX();
    bar1.clearOverlap();
    bar1.calculateOverlapBarIds();

    bar2.resetTimeRange();
    bar2.calculatePosX();
    bar2.clearOverlap();
    bar2.calculateOverlapBarIds();

    bars.calculateGroupBarsRowIndex(1);

    expect(bar1.rowIndex).toBe(0);
    expect(bar2.rowIndex).toBe(1);


    bars.add({
      bars,
      bus,
      config,
      layoutConfig,
      id: 3,
      group: groups.getById(1)!,
      duration: 2 * 24 * 60 * 60,
      start: '2025-01-03 12:00:00',
      end: '2025-01-05 00:00:00',
      groups
    });
    const bar3 = bars.getById(3)!;

    bar3.resetTimeRange();
    bar3.calculatePosX();
    bar3.clearOverlap();
    bar3.calculateOverlapBarIds();

    bars.calculateGroupBarsRowIndex(1, 3);

    expect(bar1.rowIndex).toBe(0);
    expect(bar2.rowIndex).toBe(1);
    expect(bar3.rowIndex).toBe(0);
  });
});