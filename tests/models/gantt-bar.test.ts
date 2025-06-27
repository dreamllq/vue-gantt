import { GanttBar } from '@/models/gantt-bar';
import { GanttConfig } from '@/models/gantt-config';
import { GanttGroup } from '@/models/gantt-group';
import { GanttGroupWorkTime } from '@/models/gantt-group-work-time';
import { GanttGroupWorkTimes } from '@/models/gantt-group-work-times';
import { GanttLayoutConfig } from '@/models/gantt-layout-config';

describe('gantt-bar', () => {
  const layoutConfig = new GanttLayoutConfig({ });
  const config = new GanttConfig({
    endDate: '',
    layoutConfig,
    startDate: ''
  });
  test('base', () => {
    const gb = new GanttBar({
      id: 1,
      layoutConfig,
      config: config,
      group: new GanttGroup({
        id: 1,
        config,
        layoutConfig 
      }),
      duration: 100,
      start: '2025-01-01 00:00:00',
      end: null
    });

    expect(gb.end).toBe('2025-01-01 00:01:40');
  });

  test('有休息日', () => {
    const ggwts = new GanttGroupWorkTimes();
    ggwts.push(new GanttGroupWorkTime({
      start: '2025-01-01 01:00:00',
      end: '2025-01-01 02:00:00' 
    }));
    const gb = new GanttBar({
      id: 1,
      layoutConfig,
      config,
      group: new GanttGroup({
        id: 1,
        workTimes: ggwts,
        config,
        layoutConfig
      }),
      duration: 100,
      start: '2025-01-01 00:00:00',
      end: null
    });

    expect(gb.end).toBe('2025-01-01 01:01:40');
  });
});