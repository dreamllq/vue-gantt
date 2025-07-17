import { GanttMilestoneView } from '@/models/gantt-milestone-view';
import { GanttGroups } from '@/models/gantt-groups';
import { GanttConfig } from '@/models/gantt-config';
import { GroupId } from '@/types/gantt-group';
// import { Unit } from '@/types/unit';
// import { strToDate } from '@/utils/to-date';
import { GanttLayoutConfig } from '@/models/gantt-layout-config';

// 模拟依赖
jest.mock('@/utils/date-diff', () => ({ dateDiff: jest.fn().mockReturnValue(100) }));
jest.mock('@/utils/to-date', () => ({ strToDate: jest.fn().mockReturnValue(new Date()) }));

describe('GanttMilestoneView', () => {
  const mockConfig = {
    startDate: '2023-01-01',
    endDate: '2023-01-31',
    secondWidth: 0.5,
    layoutConfig: new GanttLayoutConfig({})
  };

  const mockGroups = {
    getGroupIndex: jest.fn().mockReturnValue(0),
    getGroupTopByIndex: jest.fn().mockReturnValue(20),
    getById: jest.fn().mockReturnValue({ height: 40 })
  } as unknown as GanttGroups;

  const baseParams = {
    id: 'milestone-1',
    datetime: '2023-01-10',
    group: { id: 'group-1' as GroupId },
    text: 'Test Milestone',
    config: mockConfig,
    groups: mockGroups
  };

  it('构造函数正确初始化属性', () => {
    const milestone = new GanttMilestoneView(baseParams as any);
    
    expect(milestone.x).toBe(0);
    expect(milestone.y).toBe(0);
    expect(milestone.isShow).toBe(true);
    expect(milestone.groups).toBe(mockGroups);
  });

  describe('calculate() 方法', () => {
    it('当 isShow=false 时跳过计算', () => {
      const milestone = new GanttMilestoneView({ ...baseParams } as any);
      milestone.isShow = false;
      
      milestone.calculate();
      
      expect(milestone.x).toBe(0);
      expect(milestone.y).toBe(0);
    });

    it('当 isShow=true 时正确计算坐标', () => {
      const milestone = new GanttMilestoneView({ ...baseParams } as any);
      
      milestone.calculate();
      
      expect(milestone.x).toBe(50); // 100 * 0.5 = 50
      expect(milestone.y).toBe(40); // 20 + (40/2) = 40
    });
  });

  it('toUiJSON() 返回正确的数据结构', () => {
    const milestone = new GanttMilestoneView({ ...baseParams } as any);
    milestone.calculate();
    
    const result = milestone.toUiJSON();
    
    expect(result).toEqual({
      id: 'milestone-1',
      text: 'Test Milestone',
      x: 50,
      y: 40,
      isShow: true,
      groupId: 'group-1',
      datetime: '2023-01-10'
    });
  });

  it('toJSON() 返回正确的数据结构', () => {
    const milestone = new GanttMilestoneView({ ...baseParams } as any);
    
    const result = milestone.toJSON();
    
    expect(result).toEqual({
      id: 'milestone-1',
      datetime: '2023-01-10',
      groupId: 'group-1',
      text: 'Test Milestone'
    });
  });
});