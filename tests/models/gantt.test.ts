import { Gantt } from '@/models/gantt';
import { GanttConfig } from '@/models/gantt-config';
import { GanttLayoutConfig } from '@/models/gantt-layout-config';

describe('gantt', () => {
  const layoutConfig = new GanttLayoutConfig({ });
  const config = new GanttConfig({
    endDate: '',
    layoutConfig,
    startDate: ''
  });
  test('batchAddGroup 层级数据乱序', () => {
    const gantt = new Gantt({
      config,
      layoutConfig
    });

    gantt.batchAddGroup([
      {
        id: '1-1-1',
        parentId: '1-1' 
      },
      {
        id: '1-1',
        parentId: '1'
      },
      { id: '2' },
      { id: '1' }
    ]);

    expect(gantt.groups.getById('1-1')?.parent?.id).toBe('1');
    expect(gantt.groups.getById('1-1-1')?.parent?.id).toBe('1-1');
  });

  test('fromJson', () => {
    const gantt = Gantt.fromJson({
      config: {
        endDate: '',
        startDate: '',
        durationUnit: 'second'
      },
      groups: [
        {
          id: 1,
          parentId: null
        }
      ],
      bars: [
        {
          duration: 10,
          end: null,
          groupId: 1,
          id: 1,
          start: '2024-01-01 00:00:00'
        },
        {
          duration: 10,
          end: null,
          groupId: 1,
          id: 2,
          start: '2024-01-01 00:00:00'
        }
      ],
      links: [
        {
          id: 1,
          sourceId: 1,
          targetId: 2,
          linkType: 'FINISH_TO_START'
        }
      ]
    });
    expect(gantt.groups.getById(1)?.id).toBe(1);
    expect(gantt.groups.getById(1)).toBe(gantt.bars.getById(1)?.group);
    expect(gantt.groups.getById(1)).toBe(gantt.bars.getById(2)?.group);
    expect(gantt.links.getById(1)?.source).toBe(gantt.bars.getById(1));
    expect(gantt.links.getById(1)?.target).toBe(gantt.bars.getById(2));
    expect(gantt.links.getById(1)?.linkType).toBe('FINISH_TO_START');
  });
});