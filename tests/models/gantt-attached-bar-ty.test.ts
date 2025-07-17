import { GanttAttachedBar } from '@/models/gantt-attached-bar';
import { GanttGroup } from '@/models/gantt-group';
import { GanttBase } from '@/models/gantt-base';

// 模拟 GanttBase 的子类，以验证继承逻辑
class MockGanttBase extends GanttBase {
  constructor(data: any) {
    super(data);
  }
}

describe('GanttAttachedBar', () => {
  it('should create an instance with the correct properties', () => {
    const mockGroup = new GanttGroup({ id: 'group-1' } as any);
    const data = {
      id: 'bar-1',
      group: mockGroup,
      start: '2023-10-01T00:00:00Z',
      end: '2023-10-02T00:00:00Z'
    };

    const bar = new GanttAttachedBar(data as any);

    expect(bar.id).toBe(data.id);
    expect(bar.group).toBe(data.group);
    expect(bar.start).toBe(data.start);
    expect(bar.end).toBe(data.end);
  });

  it('should inherit from GanttBase', () => {
    const mockGroup = new GanttGroup({ id: 'group-1' } as any);
    const data = {
      id: 'bar-1',
      group: mockGroup,
      start: '2023-10-01T00:00:00Z',
      end: '2023-10-02T00:00:00Z'
    };

    const bar = new GanttAttachedBar(data as any);

    expect(bar).toBeInstanceOf(GanttBase);
  });

  it('should handle minimal required data', () => {
    const mockGroup = new GanttGroup({ id: 'group-1' } as any);
    const data = {
      id: 'bar-1',
      group: mockGroup,
      start: '2023-10-01T00:00:00Z',
      end: '2023-10-02T00:00:00Z'
    };

    const bar = new GanttAttachedBar(data as any);

    expect(bar).toBeDefined();
  });
});