import { GanttBar } from '@/models/gantt-bar';
import { GanttConfig } from '@/models/gantt-config';
import { GanttGroup } from '@/models/gantt-group';
import { GanttGroupWorkTime } from '@/models/gantt-group-work-time';
import { GanttGroupWorkTimes } from '@/models/gantt-group-work-times';

describe('gantt-bar', () => {
  test('base', () => {
    const gb = new GanttBar({
      id: 1,
      config: new GanttConfig({
        startDate: '',
        endDate: '' 
      }),
      group: new GanttGroup({ id: 1 }),
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
      config: new GanttConfig({
        startDate: '',
        endDate: '' 
      }),
      group: new GanttGroup({
        id: 1,
        workTimes: ggwts
      }),
      duration: 100,
      start: '2025-01-01 00:00:00',
      end: null
    });

    expect(gb.end).toBe('2025-01-01 01:01:40');
  });
});