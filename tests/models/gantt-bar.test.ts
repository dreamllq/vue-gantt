import { GanttBar } from '@/models/gantt-bar';
import { GanttBars } from '@/models/gantt-bars';
import { GanttBus } from '@/models/gantt-bus';
import { GanttConfig } from '@/models/gantt-config';
import { GanttGroup } from '@/models/gantt-group';
import { GanttGroupWorkTime } from '@/models/gantt-group-work-time';
import { GanttGroupWorkTimes } from '@/models/gantt-group-work-times';
import { GanttGroups } from '@/models/gantt-groups';
import { GanttLayoutConfig } from '@/models/gantt-layout-config';

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
    const ggwts = new GanttGroupWorkTimes();
    ggwts.push(new GanttGroupWorkTime({
      start: '2025-01-01 01:00:00',
      end: '2025-01-01 02:00:00' 
    }));

    const groups = new GanttGroups({
      bus,
      config,
      layoutConfig
    });
    groups.add({
      bus,
      config,
      layoutConfig,
      id: 1,
      workTimes: ggwts
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
    const ggwts = new GanttGroupWorkTimes();
    ggwts.push(new GanttGroupWorkTime({
      start: '2025-01-01 01:00:00',
      end: '2025-01-01 02:00:00' 
    }));

    const groups = new GanttGroups({
      bus,
      config,
      layoutConfig
    });
    groups.add({
      bus,
      config,
      layoutConfig,
      id: 1,
      workTimes: ggwts
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