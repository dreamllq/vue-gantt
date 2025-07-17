import { GanttWorkTimes } from '@/models/gantt-work-times';
import { GanttWorkViewTimeConstructor } from '@/types/gantt-work-time';
import { GanttWorkTimeView } from '@/models/gantt-work-time-view';
import { GanttConfig } from '@/models/gantt-config';
import { GanttGroups } from '@/models/gantt-groups';
import { GanttBus } from '@/models/gantt-bus';
import { GanttBusEvents } from '@/types/gantt-bus';
import { GanttJsonDataWorkTime } from '@/types/gantt';
import { Unit } from '@/types/unit';
import { GanttGroup } from '@/models/gantt-group';
import { dateTimeFormat } from '@/utils/date-time-format';
import { GanttLayoutConfig } from '@/models/gantt-layout-config';

// 模拟依赖类
class MockGanttWorkTimeView extends GanttWorkTimeView {
  calculate = jest.fn();
  toJSON = jest.fn().mockReturnValue({
    id: '1',
    isShow: true 
  });
}

describe('GanttWorkTimes', () => {
  let ganttWorkTimes: GanttWorkTimes;
  let mockConfig: GanttConfig;
  let mockGroups: GanttGroups;
  let mockBus: GanttBus;

  beforeEach(() => {
    mockBus = new GanttBus();
    mockConfig = new GanttConfig({
      startDate: '2023-01-01',
      endDate: '2023-01-31',
      layoutConfig: ({} as any),
      dataScaleUnit: Unit.DAY
    });
    mockGroups = new GanttGroups({
      bus: mockBus,
      config: mockConfig,
      layoutConfig: ({} as any)
    });

    ganttWorkTimes = new GanttWorkTimes({
      config: mockConfig,
      groups: mockGroups,
      bus: mockBus
    });
  });

  describe('constructor', () => {
    it('should initialize with correct dependencies', () => {
      expect(ganttWorkTimes.config).toBe(mockConfig);
      expect(ganttWorkTimes.groups).toBe(mockGroups);
      expect(ganttWorkTimes.bus).toBe(mockBus);
    });

    it('should listen to SHOW_CHANGE event and call updateShow', () => {
      const updateShowSpy = jest.spyOn(ganttWorkTimes, 'updateShow');
      mockBus.emit(GanttBusEvents.SHOW_CHANGE);
      expect(updateShowSpy).toHaveBeenCalled();
    });

    it('should handle GROUP_BARS_HEIGHT_CHANGE event', () => {
      const emitSpy = jest.spyOn(mockBus, 'emit');

      const workTimes = ['wt1', 'wt2'] as any;
      workTimes.getIds = () => ['wt1', 'wt2'];
      const mockGroup = {
        id: '1',
        workTimes: workTimes
      };
      mockGroups.getById = jest.fn().mockReturnValue(mockGroup as any);

      mockBus.emit(GanttBusEvents.GROUP_BARS_HEIGHT_CHANGE, { groupId: '1' });
      expect(emitSpy).toHaveBeenCalledWith(GanttBusEvents.WORK_TIME_CHANGE, ['wt1', 'wt2']);
    });

    it('should handle GROUP_TOP_CHANGE event', () => {
      const emitSpy = jest.spyOn(mockBus, 'emit');
      const mockGroup = {
        id: '1',
        workTimes: { getIds: () => ['wt1', 'wt2'] } 
      };
      mockGroups.getById = jest.fn().mockReturnValue(mockGroup as any);

      mockBus.emit(GanttBusEvents.GROUP_TOP_CHANGE, ['1']);
      expect(emitSpy).toHaveBeenCalledWith(GanttBusEvents.WORK_TIME_CHANGE, ['wt1', 'wt2']);
    });

    it('should handle GROUPS_CHANGE event and calculate added workTimes', () => {
      const workTimes: any = ['wt1'];
      workTimes.getIds = () => ['wt1'];
      workTimes.forEach = (cb: (item: any) => void) => cb({
        calculate: jest.fn(),
        id: 'wt1' 
      });
      const mockGroup = {
        id: '1',
        workTimes: workTimes
      };
      mockGroups.getById = jest.fn().mockReturnValue(mockGroup as any);
      const emitSpy = jest.spyOn(mockBus, 'emit');

      mockBus.emit(GanttBusEvents.GROUPS_CHANGE, { addGroupIds: ['1'] } as any);
      expect(emitSpy).toHaveBeenCalledWith(GanttBusEvents.WORK_TIME_CHANGE, ['wt1']);
    });
  });

  describe('add', () => {
    it('should add a new workTime and bind it to the group', () => {
      const data: GanttWorkViewTimeConstructor = {
        id: '1',
        group: { id: 'group1' } as GanttGroup,
        start: dateTimeFormat(new Date()),
        end: dateTimeFormat(new Date()),
        config: {} as GanttConfig,
        layoutConfig: {} as GanttLayoutConfig,
        groups: mockGroups
      };
      const mockGroup = {
        id: 'group1',
        workTimes: []
      };
      mockGroups.getById = jest.fn().mockReturnValue(mockGroup as any);

      const addSpy = jest.spyOn(mockGroups.getById('group1')!.workTimes, 'push');
      ganttWorkTimes.add(data);

      expect(ganttWorkTimes.length).toBe(1);
      expect(addSpy).toHaveBeenCalled();
    });
  });

  describe('calculate', () => {
    it('should call calculate on each workTime', () => {
      const mockWorkTime = new MockGanttWorkTimeView({
        start: '2025-01-01 00:00:00',
        end: '2025-01-01 00:00:00' 
      } as any);
      mockWorkTime.calculate.mockReturnValue(undefined);
      const calculateSpy = jest.spyOn(mockWorkTime, 'calculate');
      ganttWorkTimes.push(mockWorkTime);

      ganttWorkTimes.calculate();
      expect(calculateSpy).toHaveBeenCalled();
    });
  });

  describe('updateShow', () => {
    it('should set isShow based on group visibility', () => {
      const mockWorkTime = new MockGanttWorkTimeView({
        group: { id: 'group1' },
        start: '2025-01-01 00:00:00',
        end: '2025-01-01 00:00:00' 
      } as any);
      mockWorkTime.isShow = false;
      ganttWorkTimes.push(mockWorkTime);

      const mockGroup = {
        id: 'group1',
        isShow: true 
      };
      mockGroups.getById = jest.fn().mockReturnValue(mockGroup as any);

      ganttWorkTimes.updateShow();
      expect(mockWorkTime.isShow).toBe(true);
    });
  });

  describe('toJSON', () => {
    it('should return serialized workTimes', () => {
      const mockWorkTime = new MockGanttWorkTimeView({
        start: '2025-01-01 00:00:00',
        end: '2025-01-01 00:00:00' 
      } as any);
      ganttWorkTimes.push(mockWorkTime);

      const result = ganttWorkTimes.toJSON();
      expect(result).toEqual([
        {
          id: '1',
          isShow: true 
        }
      ]);
    });
  });
});