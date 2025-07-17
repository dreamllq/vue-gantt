import { GanttWorkTime } from '@/models/gantt-work-time';
import { GanttWorkTimeConstructor } from '@/types/gantt-work-time';
import { strToDate } from '@/utils/to-date';
import { dateDiff } from '@/utils/date-diff';
import { Unit } from '@/types/unit';
import { GanttGroup } from '@/models/gantt-group';
import { GanttGroupClassConstructor } from '@/types/gantt-group';
import { GanttConfig } from '@/models/gantt-config';
import { GanttWorkTimeView } from '@/models/gantt-work-time-view';

describe('GanttWorkTime', () => {
  let mockData: GanttWorkTimeConstructor;

  beforeEach(() => {
    mockData = {
      id: 'worktime-1',
      start: '2023-10-01T08:00:00',
      end: '2023-10-01T10:00:00',
      group: new GanttGroup({ id: 'group-1' } as GanttGroupClassConstructor)
    } as GanttWorkTimeConstructor;
  });

  it('should correctly initialize properties', () => {
    const workTime = new GanttWorkTime(mockData);

    expect(workTime.id).toBe(mockData.id);
    expect(workTime.start).toBe(mockData.start);
    expect(workTime.end).toBe(mockData.end);
    expect(workTime.group).toBe(mockData.group);
  });

  it('should calculate seconds between start and end time correctly', () => {
    const workTime = new GanttWorkTime(mockData);
    const startDate = strToDate(mockData.start);
    const endDate = strToDate(mockData.end);
    const expectedSeconds = dateDiff(endDate, startDate, Unit.SECOND);

    expect(workTime.seconds).toBe(expectedSeconds);
  });

  it('should convert start and end times to milliseconds correctly', () => {
    const workTime = new GanttWorkTime(mockData);

    expect(workTime.startTimeMills).toBe(strToDate(mockData.start).getTime());
    expect(workTime.endTimeMills).toBe(strToDate(mockData.end).getTime());
  });

  it('should return correct difference in seconds when start equals end', () => {
    const sameTime = '2023-10-01T08:00:00';
    const workTime = new GanttWorkTime({
      ...mockData,
      start: sameTime,
      end: sameTime
    });

    expect(workTime.seconds).toBe(0);
  });

  it('should handle edge case where start is before end', () => {
    const workTime = new GanttWorkTime(mockData);
    expect(workTime.seconds).toBeGreaterThan(0);
  });

  it('should handle invalid dates gracefully (if applicable)', () => {
    expect(() => {
      new GanttWorkTime({
        ...mockData,
        start: 'invalid-date',
        end: 'another-invalid-date'
      });
    }).toThrowError('Invalid date format'); 
  });

  it('should correctly calculate sy and height when isShow is true', () => {
    const mockGroup = {
      id: 'group-1',
      height: 50 
    };
    const mockGroups = {
      getById: jest.fn().mockReturnValue(mockGroup as any),
      getGroupIndex: jest.fn().mockReturnValue(0),
      getGroupTopByIndex: jest.fn().mockReturnValue(100)
    };
    const mockConfig: any = {
      startTime: '2023-10-01T00:00:00',
      secondWidth: 2
    };

    const workTimeView = new GanttWorkTimeView({
      ...mockData,
      groups: mockGroups as any,
      config: mockConfig as any
    });

    workTimeView.isShow = true;
    workTimeView.calculate();

    expect(workTimeView.sy).toBe(100);
    expect(workTimeView.height).toBe(50);
  });

  it('should correctly calculate sx and width based on config', () => {
    const mockConfig: any = {
      startTime: '2023-10-01T00:00:00',
      secondWidth: 2
    };

    const mockGroup = {
      id: 'group-1',
      height: 50 
    };
    const mockGroups = {
      getById: jest.fn().mockReturnValue(mockGroup as any),
      getGroupIndex: jest.fn().mockReturnValue(0),
      getGroupTopByIndex: jest.fn().mockReturnValue(100)
    };

    const workTimeView = new GanttWorkTimeView({
      ...mockData,
      groups: mockGroups as any, // 简化 groups 依赖
      config: mockConfig as any
    });

    workTimeView.calculate();

    const expectedSx = Math.floor((workTimeView.startTimeMills - mockConfig.startTimeMills) / 1000) * mockConfig.secondWidth;
    const expectedWidth = workTimeView.seconds * mockConfig.secondWidth;

    expect(workTimeView.sx).toBe(expectedSx);
    expect(workTimeView.width).toBe(expectedWidth);
  });

  it('should set sy and height to 0 when isShow is false in updateY', () => {
    const workTimeView = new GanttWorkTimeView({
      ...mockData,
      groups: {} as any,
      config: {} as any
    });

    workTimeView.isShow = false;
    workTimeView.updateY();

    expect(workTimeView.sy).toBe(0);
    expect(workTimeView.height).toBe(0);
  });

  it('should update sy and height correctly when isShow is true in updateY', () => {
    const mockGroup = {
      id: 'group-1',
      height: 60 
    };
    const mockGroups = {
      getById: jest.fn().mockReturnValue(mockGroup),
      getGroupIndex: jest.fn().mockReturnValue(1),
      getGroupTopByIndex: jest.fn().mockReturnValue(150)
    };

    const workTimeView = new GanttWorkTimeView({
      ...mockData,
      group: mockGroup as any,
      groups: mockGroups as any,
      config: {} as any
    });

    workTimeView.isShow = true;
    workTimeView.updateY();

    expect(workTimeView.sy).toBe(150);
    expect(workTimeView.height).toBe(60);
  });

  it('should return correct JSON structure', () => {
    const workTimeView = new GanttWorkTimeView({
      ...mockData,
      groups: {} as any,
      config: {} as any
    });

    const json = workTimeView.toJSON();

    expect(json).toEqual({
      id: mockData.id,
      start: mockData.start,
      end: mockData.end,
      groupId: mockData.group.id
    });
  });
});