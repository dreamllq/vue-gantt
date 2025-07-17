import { GanttBarUpdateOperation } from '@/models/gantt-operation';
import { GanttBars } from '@/models/gantt-bars';
import { GanttGroups } from '@/models/gantt-groups';
import { GanttGroup } from '@/models/gantt-group';
import { GanttBus } from '@/models/gantt-bus';
import { GanttBusEvents } from '@/types/gantt-bus';

describe('GanttBarUpdateOperation', () => {
  let barsMock: jest.Mocked<GanttBars>;
  let groupsMock: jest.Mocked<GanttGroups>;
  let busMock: jest.Mocked<GanttBus>;
  let group1Mock: jest.Mocked<GanttGroup>;
  let group2Mock: jest.Mocked<GanttGroup>;

  beforeEach(() => {
    group1Mock = {
      id: 'group1',
      calculate: jest.fn()
    } as any;

    group2Mock = {
      id: 'group2',
      calculate: jest.fn()
    } as any;

    barsMock = {
      getById: jest.fn().mockReturnValue({
        id: 'bar1',
        group: group1Mock,
        start: 0,
        end: 0,
        rowIndex: 0,
        draggable: false,
        selectable: false,
        schedulingMode: 'auto',
        calculate: jest.fn()
      }),
      calculateGroupOverlap: jest.fn()
    } as any;

    groupsMock = { getById: jest.fn((id: string) => (id === 'group1' ? group1Mock : group2Mock)) } as any;

    busMock = { emit: jest.fn() } as any;
  });

  it('should update bar properties and emit BAR_CHANGE event on up()', () => {
    const operation = new GanttBarUpdateOperation({
      bus: busMock,
      bars: barsMock,
      groups: groupsMock,
      oldData: {
        barId: 'bar1',
        groupId: 'group1',
        start: 0,
        end: 0,
        rowIndex: 0,
        draggable: false,
        selectable: false,
        schedulingMode: 'auto'
      } as any,
      newData: {
        barId: 'bar1',
        groupId: 'group2',
        start: 100,
        end: 200,
        rowIndex: 1,
        draggable: true,
        selectable: true,
        schedulingMode: 'manual'
      } as any
    });

    operation.up();

    const bar = barsMock.getById('bar1')!;
    expect(bar.start).toBe(100);
    expect(bar.end).toBe(200);
    expect(bar.rowIndex).toBe(1);
    expect(bar.draggable).toBe(true);
    expect(bar.selectable).toBe(true);
    expect(bar.schedulingMode).toBe('manual');
    expect(bar.group.id).toBe('group2');

    expect(barsMock.calculateGroupOverlap).toHaveBeenCalledWith({ groupId: 'group1' });
    expect(busMock.emit).toHaveBeenCalledWith(GanttBusEvents.BAR_CHANGE, ['bar1']);
  });

  it('should restore bar properties and emit BAR_CHANGE event on down()', () => {
    const operation = new GanttBarUpdateOperation({
      bus: busMock,
      bars: barsMock,
      groups: groupsMock,
      oldData: {
        barId: 'bar1',
        groupId: 'group1',
        start: 0,
        end: 0,
        rowIndex: 0,
        draggable: false,
        selectable: false,
        schedulingMode: 'auto'
      } as any,
      newData: {
        barId: 'bar1',
        groupId: 'group2',
        start: 100,
        end: 200,
        rowIndex: 1,
        draggable: true,
        selectable: true,
        schedulingMode: 'manual'
      } as any
    });
    barsMock.getById.mockReturnValue({
      id: 'bar1',
      group: group2Mock,
      start: 0,
      end: 0,
      rowIndex: 0,
      draggable: false,
      selectable: false,
      schedulingMode: 'auto',
      calculate: jest.fn()
    } as any);
    operation.down();

    const bar = barsMock.getById('bar1')!;
    expect(bar.start).toBe(0);
    expect(bar.end).toBe(0);
    expect(bar.rowIndex).toBe(0);
    expect(bar.draggable).toBe(false);
    expect(bar.selectable).toBe(false);
    expect(bar.schedulingMode).toBe('auto');
    expect(bar.group.id).toBe('group1');

    expect(barsMock.calculateGroupOverlap).toHaveBeenCalledWith({ groupId: 'group2' });
    expect(busMock.emit).toHaveBeenCalledWith(GanttBusEvents.BAR_CHANGE, ['bar1']);
  });

  it('should not call calculateGroupOverlap if group did not change', () => {
    const operation = new GanttBarUpdateOperation({
      bus: busMock,
      bars: barsMock,
      groups: groupsMock,
      oldData: {
        barId: 'bar1',
        groupId: 'group1',
        start: 0,
        end: 0,
        rowIndex: 0,
        draggable: false,
        selectable: false,
        schedulingMode: 'auto'
      } as any,
      newData: {
        barId: 'bar1',
        groupId: 'group1',
        start: 100,
        end: 200,
        rowIndex: 1,
        draggable: true,
        selectable: true,
        schedulingMode: 'manual'
      } as any
    });

    operation.up();
    expect(barsMock.calculateGroupOverlap).not.toHaveBeenCalledWith({ groupId: 'group1' });
  });
});