import { GanttMilestone } from '@/models/gantt-milestone';
import { GanttGroup } from '@/models/gantt-group';
import { GanttBase } from '@/models/gantt-base';

// 模拟依赖类
class MockGanttGroup extends GanttGroup {
  constructor() {
    super({ id: 'group-1' } as any);
  }
}

describe('GanttMilestone', () => {
  const mockData = {
    id: 'milestone-1',
    group: new MockGanttGroup(),
    datetime: '2025-04-05T00:00:00Z',
    text: 'Test Milestone'
  };

  it('should create an instance with provided data', () => {
    const milestone = new GanttMilestone(mockData as any);

    expect(milestone).toBeInstanceOf(GanttMilestone);
    expect(milestone.id).toBe(mockData.id);
    expect(milestone.group).toBe(mockData.group);
    expect(milestone.datetime).toBe(mockData.datetime);
    expect(milestone.text).toBe(mockData.text);
  });

  // it('should call super constructor with data', () => {
  //   const spy = jest.spyOn(GanttBase.prototype, 'constructor');
  //   const milestone = new GanttMilestone(mockData);
  //   expect(spy).toHaveBeenCalledWith(mockData);
  //   spy.mockRestore();
  // });

  it('should set default text if not provided', () => {
    const dataWithoutText = {
      id: 'milestone-2',
      group: new MockGanttGroup(),
      datetime: '2025-04-06T00:00:00Z'
    };

    const milestone = new GanttMilestone(dataWithoutText as any);
    expect(milestone.text).toBe('');
  });
});