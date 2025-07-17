import { GanttMilestones } from '../../src/models/gantt-milestones';
import { GanttGroups } from '../../src/models/gantt-groups';
import { GanttMilestoneView } from '../../src/models/gantt-milestone-view';
import { GanttMilestoneViewClassConstructor } from '../../src/types/gantt-milestone';
import { GroupId } from '../../src/types/gantt-group';
import { GanttJsonDataMilestone } from '../../src/types/gantt';
import { GanttBus } from '@/models/gantt-bus';
jest.mock('@/utils/to-date', () => ({ strToDate: jest.fn().mockReturnValue(new Date()) }));

const bus = new GanttBus();
// Mock GanttGroups
class MockGanttGroups extends GanttGroups {
  bus: GanttBus = bus;
  getById = jest.fn();
  getGroupIndex = jest.fn();
}

// Mock GanttMilestoneView
class MockGanttMilestoneView extends GanttMilestoneView {
  bus = bus;
  id = 'mock-milestone';
  group = { id: 'group1' } as any;
  calculate = jest.fn();
  toJSON = jest.fn().mockReturnValue({ id: 'mock-milestone' });
}

describe('GanttMilestones', () => {
  let milestones: GanttMilestones;
  let mockGroups: MockGanttGroups;
  let mockMilestone: MockGanttMilestoneView;

  beforeEach(() => {
    mockGroups = new MockGanttGroups({ bus } as any);
    mockMilestone = new MockGanttMilestoneView({
      id: 'milestone1',
      name: 'Test Milestone',
      time: new Date(),
      group: { id: 'group1' },
      bus,
      groups: mockGroups,
      config: { start: new Date() }
    } as any);

    milestones = new GanttMilestones({
      groups: mockGroups as any,
      bus 
    } as any);
  });

  test('constructor initializes correctly', () => {
    expect(milestones.groups).toBe(mockGroups);
  });

  test('add() adds milestone to group', () => {
    const mockGroup = {
      id: 'group1',
      milestones: { push: jest.fn() },
      bus
    };
    mockGroups.getById.mockReturnValue(mockGroup);
        
    milestones.add({
      id: 'milestone1',
      name: 'Test Milestone',
      time: new Date(),
      group: { id: 'group1' }
    } as any);

    expect(milestones.length).toBe(1);
    expect(mockGroup.milestones.push).toHaveBeenCalled();
  });

  test('removeById() removes milestone from group', () => {
    const mockGroup = {
      id: 'group1',
      milestones: {
        push: jest.fn(),
        removeById: jest.fn() 
      },
      bus
    };
    mockGroups.getById.mockReturnValue(mockGroup);
    milestones.add(mockMilestone);
  
    expect(milestones.length).toBe(1);
        
    milestones.removeById(mockMilestone.id);
        
    expect(milestones.length).toBe(0);
    expect(mockGroup.milestones.removeById).toHaveBeenCalledWith(mockMilestone.id);
  });

  // test('calculate() calls calculate on all milestones', () => {
  //   const mockGroup = {
  //     id: 'group1',
  //     milestones: {
  //       push: jest.fn(),
  //       removeById: jest.fn() 
  //     },
  //     bus
  //   };
  //   mockGroups.getById.mockReturnValue(mockGroup);
  //   milestones.add(mockMilestone);
  //   expect(milestones.length).toBe(1);
  //   milestones.calculate();
        
  //   expect(mockMilestone.calculate).toHaveBeenCalledTimes(1);
  // });

  test('updateShow() updates milestone visibility based on group', () => {
    const mockGroup = {
      id: 'group1',
      milestones: {
        push: jest.fn(),
        removeById: jest.fn() 
      },
      bus
    };
    mockGroups.getById.mockReturnValue(mockGroup);
        
    milestones.add(mockMilestone);
    milestones.updateShow();
        
    expect(mockMilestone.isShow).toBe(true);
  });

  test('updateGroupExpandChangeEffectBar() updates milestones correctly', () => {
    // Mock dependencies
    // const min = jest.fn().mockReturnValue(0);
    // jest.mock('../../src/utils/utils', () => ({ min }));
        
    const changedGroupIds: GroupId[] = ['group1'];
    const mockGroup = { 
      id: 'group1', 
      isShow: true,
      milestones: [mockMilestone]
    };
        
    mockGroups.getById.mockReturnValue(mockGroup);
    mockGroups.expandedGroups = [mockGroup as any];
        
    milestones.add(mockMilestone);
    milestones.updateGroupExpandChangeEffectBar(changedGroupIds);
        
    expect(mockMilestone.calculate).toHaveBeenCalled();
  });

  test('toJSON() returns correct data structure', () => {
    const mockGroup = { 
      id: 'group1', 
      isShow: true,
      milestones: [mockMilestone]
    };
        
    mockGroups.getById.mockReturnValue(mockGroup);
    mockMilestone.toJSON.mockReturnValue({ id: 'milestone1' });
    milestones.add(mockMilestone);
        
    const result = milestones.toJSON();
        
    expect(result[0].id).toEqual(mockMilestone.id);
  });

  test('array methods throw errors as expected', () => {
    expect(() => milestones.push(mockMilestone)).toThrow('Method not implemented.');
    expect(() => milestones.pop()).toThrow('Method not implemented.');
    expect(() => milestones.shift()).toThrow('Method not implemented.');
    expect(() => milestones.unshift(mockMilestone)).toThrow('Method not implemented.');
    expect(() => milestones.splice(0, 1)).toThrow('Method not implemented.');
  });

  test('removeById() handles non-existent milestone gracefully', () => {
    milestones.removeById('non-existent-id');
    expect(milestones.length).toBe(0); // No error should occur
  });
});