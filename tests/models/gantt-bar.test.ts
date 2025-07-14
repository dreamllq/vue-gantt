import { GanttBars } from '@/models/gantt-bars';
import { GanttBus } from '@/models/gantt-bus';
import { GanttConfig } from '@/models/gantt-config';
import { GanttGroup } from '@/models/gantt-group';

import { GanttGroups } from '@/models/gantt-groups';
import { GanttLayoutConfig } from '@/models/gantt-layout-config';
import { GanttWorkTimes } from '@/models/gantt-work-times';

describe('gantt-bar', () => {
  const layoutConfig = new GanttLayoutConfig({ });
  const config = new GanttConfig({
    endDate: '',
    layoutConfig,
    startDate: ''
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
    gb.resetTimeRange();

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
    gb.resetTimeRange();

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
    gb.resetTimeRange();

    expect(gb.end).toBe('2025-01-01 01:02:40');
    expect(gb.start).toBe('2025-01-01 01:01:00');
  });
});