import { GanttWorkTime } from '@/models/gantt-work-time';
import { GanttWorkTimeConstructor } from '@/types/gantt-work-time';
import { strToDate } from '@/utils/to-date';
import { dateDiff } from '@/utils/date-diff';
import { Unit } from '@/types/unit';
import { GanttGroup } from '@/models/gantt-group';

describe('GanttWorkTime', () => {
  let mockData: GanttWorkTimeConstructor;

  beforeEach(() => {
    mockData = {
      id: 'worktime-1',
      start: '2023-10-01T08:00:00',
      end: '2023-10-01T09:00:00',
      group: ({
        id: 'group-1'
        // 其他属性根据 GanttGroup 定义补充
      } as GanttGroup)
      // 如果 GanttBase 包含其他字段，也需要在这里添加
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
});