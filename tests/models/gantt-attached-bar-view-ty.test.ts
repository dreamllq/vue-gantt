import { GanttAttachedBarView } from '@/models/gantt-attached-bar-view';
import { GanttGroups } from '@/models/gantt-groups';
import { GanttAttachedBars } from '@/models/gantt-attached-bars';
import { GanttGroup } from '@/models/gantt-group';
import { GanttBus } from '@/models/gantt-bus';
import { GanttJsonDataAttachedBar } from '@/types/gantt';
import { strToDate } from '@/utils/to-date';

// 模拟 GanttGroups 类
class MockGanttGroups extends GanttGroups {
  getGroupIndex(group: any) {
    return 0;
  }

  getGroupTopByIndex(index: number) {
    return 100;
  }

  // @ts-ignore
  getById(id: string) {
    return {
      id,
      barsHeight: 20
    };
  }
}

// 模拟 GanttAttachedBars 类
class MockGanttAttachedBars {}

// 模拟 GanttBus 类
class MockGanttBus {
  private listeners: Record<string, ((data: any) => void)[]> = {};

  on(event: string, callback: (data: any) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }
}

describe('GanttAttachedBarView', () => {
  let groups: MockGanttGroups;
  let attachedBars: MockGanttAttachedBars;
  let bus: MockGanttBus;
  let group: GanttGroup;
  let config: any;
  let layoutConfig: any;
  let data: any;

  beforeEach(() => {
    bus = new MockGanttBus();
    attachedBars = new MockGanttAttachedBars();
    group = new GanttGroup({ id: 'group-1' } as any);

    groups = new MockGanttGroups({
      config: {
        start: '2023-10-01T00:00:00Z',
        secondWidth: 1
      } as any,
      layoutConfig: {
        ATTACHED_BAR_HEIGHT: 20,
        ATTACHED_ROW_HEIGHT: 40
      } as any,
      bus: bus as any
    });

    data = {
      id: 'bar-1',
      group,
      start: '2023-10-01T00:00:00Z',
      end: '2023-10-02T00:00:00Z',
      config: {
        start: '2023-10-01T00:00:00Z',
        secondWidth: 1
      },
      layoutConfig: {
        ATTACHED_BAR_HEIGHT: 20,
        ATTACHED_ROW_HEIGHT: 40
      },
      groups,
      attachedBars,
      bus,
      rowIndex: 1
    };
  });

  it('should initialize correctly', () => {
    const bar = new GanttAttachedBarView(data);

    expect(bar.id).toBe('bar-1');
    expect(bar.group).toBe(group);
    expect(bar.start).toBe('2023-10-01T00:00:00Z');
    expect(bar.end).toBe('2023-10-02T00:00:00Z');
    expect(bar.rowIndex).toBe(0);
    expect(bar.groups).toBe(groups);
    expect(bar.attachedBars).toBe(attachedBars);
    expect(bar.bus).toBe(bus);
  });

  it('should calculate positions correctly when isShow is true', () => {
    const bar = new GanttAttachedBarView(data);
    bar.isShow = true;
    bar.calculate();

    const startTime = Math.floor(strToDate('2023-10-01T00:00:00Z').getTime() / 1000);
    const endTime = Math.floor(strToDate('2023-10-02T00:00:00Z').getTime() / 1000);
    const configStartTime = Math.floor(strToDate('2023-10-01T00:00:00Z').getTime() / 1000);

    expect(bar.sx).toBe((startTime - configStartTime) * 1);
    expect(bar.width).toBe((endTime - startTime) * 1);
    expect(bar.ex).toBe(bar.sx + bar.width);

    expect(bar._sy).toBe(100 + 20 - 10 + 20); // groupTop + barCenterTop - height/2
    expect(bar.sy).toBe(bar._sy + 0 * 40); // rowIndex * rowHeight + group.barsHeight
    expect(bar.ey).toBe(bar.sy + 20);
    expect(bar.st).toBe(startTime * 1000);
    expect(bar.et).toBe(endTime * 1000);
  });

  it('should not calculate when isShow is false', () => {
    const bar = new GanttAttachedBarView(data);
    bar.isShow = false;
    bar.calculate();

    expect(bar.sx).toBe(0);
    expect(bar.ex).toBe(0);
    expect(bar.width).toBe(0);
    expect(bar.sy).toBe(0);
    expect(bar.ey).toBe(0);
  });

  it('should update Y positions correctly in changeY', () => {
    const bar = new GanttAttachedBarView(data);
    bar.changeY();

    expect(bar._sy).toBe(100 + 20 - 10 + 20);
    expect(bar.sy).toBe(bar._sy + 0 * 40);
    expect(bar.ey).toBe(bar.sy + 20);
  });

  it('should return correct ui JSON', () => {
    const bar = new GanttAttachedBarView(data);
    bar.calculate();

    const uiJSON = bar.toUiJSON();

    expect(uiJSON).toEqual({
      id: 'bar-1',
      sx: bar.sx,
      ex: bar.ex,
      width: bar.width,
      sy: bar.sy,
      ey: bar.ey,
      height: bar.height,
      st: bar.st,
      et: bar.et,
      rowIndex: bar.rowIndex
    });
  });

  it('should return correct JSON in toJSON', () => {
    const bar = new GanttAttachedBarView(data);
    const json: GanttJsonDataAttachedBar = bar.toJSON();

    expect(json).toEqual({
      id: 'bar-1',
      start: '2023-10-01T00:00:00Z',
      end: '2023-10-02T00:00:00Z',
      groupId: 'group-1'
    });
  });
});