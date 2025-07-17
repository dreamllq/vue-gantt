// 不导入 strToDate，防止触发真实函数
import { GanttAttachedBars } from '@/models/gantt-attached-bars';
import { GanttAttachedBarView } from '@/models/gantt-attached-bar-view';
import { GanttGroups } from '@/models/gantt-groups';
import { GanttGroup } from '@/models/gantt-group';
import { GanttBus } from '@/models/gantt-bus';
import { GanttConfig } from '@/models/gantt-config';
import { GanttLayoutConfig } from '@/models/gantt-layout-config';
import { AttachedBarId } from '@/types/gantt-attached-bar';
import { GanttBusEvents } from '@/types/gantt-bus';
import { EventEmitter } from 'events';
import { group } from 'console';

// 手动 mock 掉 strToDate 函数，避免报错
jest.mock('@/utils/to-date', () => ({ strToDate: (dateStr: string) => new Date(dateStr) }));

describe('GanttAttachedBars', () => {
  let config: GanttConfig;
  let layoutConfig: GanttLayoutConfig;
  let groups: any;
  let bus: any;
  let attachedBars: GanttAttachedBars;

  beforeEach(() => {
  // Mock GanttConfig
    config = {
      showAttachedBars: true,
      start: '2023-10-01T00:00:00Z',
      secondWidth: 1
    };

    // Mock GanttLayoutConfig
    layoutConfig = {
      ATTACHED_BAR_HEIGHT: 20,
      ATTACHED_ROW_HEIGHT: 40
    };

    // Mock GanttGroups
    function createMockAttachedBars() {

      const bars: GanttAttachedBarView[] = [];

      const funcs = {
        // filter: (predicate: (bar: GanttAttachedBarView) => boolean) => Object.values(bars).filter(predicate),
        getIds: () => bars.map(item => item.id),
        // forEach: (callback: (bar: GanttAttachedBarView) => void) => Object.values(bars).forEach(callback),
        getById: (id: AttachedBarId) => bars.find(bar => bar.id === id),
        // push: (bar: GanttAttachedBarView) => {
        //   bars[bar.id] = bar;
        // },
        removeById: (id: AttachedBarId) => {
          const index = bars.findIndex(item => item.id === id);
          bars.splice(index, 1);
        }
      };

      Object.keys(funcs).forEach(key => {
        bars[key] = funcs[key];
      });

      return bars;

      // const bars: Record<AttachedBarId, GanttAttachedBarView> = {};

      // return {
      //   filter: (predicate: (bar: GanttAttachedBarView) => boolean) => Object.values(bars).filter(predicate),
      //   getIds: () => Object.keys(bars),
      //   forEach: (callback: (bar: GanttAttachedBarView) => void) => Object.values(bars).forEach(callback),
      //   getById: (id: AttachedBarId) => bars[id],
      //   push: (bar: GanttAttachedBarView) => {
      //     bars[bar.id] = bar;
      //   },
      //   removeById: (id: AttachedBarId) => {
      //     delete bars[id];
      //   },
      //   length: Object.values(bars).length,
      //   getLength: () => Object.values(bars).length
      // };
    }

    groups = {
      expandedGroups: [
        {
          id: 'group-1',
          isShow: true,
          barsHeight: 20,
          attachedBars: createMockAttachedBars()
        },
        {
          id: 'group-2',
          isShow: true,
          barsHeight: 20,
          attachedBars: createMockAttachedBars()
        }
      ],
      getGroupIndex: (group: any) => groups.expandedGroups.findIndex((g: any) => g.id === group.id),
      getGroupTopByIndex: (index: number) => index * 100,
      getById: (id: string) => groups.expandedGroups.find((g: any) => g.id === id)
    };

    // 使用 EventEmitter 替代原生对象 mock
    bus = new EventEmitter();

    const data = {
      config,
      layoutConfig,
      groups,
      bus
    };

    attachedBars = new GanttAttachedBars(data);
  });

  it('should initialize with correct properties', () => {
    expect(attachedBars.config).toBe(config);
    expect(attachedBars.layoutConfig).toBe(layoutConfig);
    expect(attachedBars.groups).toBe(groups);
    expect(attachedBars.bus).toBe(bus);
  });

  it('should add a bar and link to the group', () => {
    const group = groups.getById('group-1')!;
    const barData = {
      id: 'bar-1',
      group,
      start: '2023-10-01T00:00:00Z',
      end: '2023-10-02T00:00:00Z',
      config,
      layoutConfig,
      groups,
      attachedBars,
      bus
    };

    const bar = new GanttAttachedBarView(barData);
    attachedBars.add(barData);

    expect(attachedBars.getById('bar-1')).toBeDefined();
    expect(group.attachedBars.getById('bar-1')).toBeDefined(); // 现在可以找到啦 ✅
  });

  it('should remove a bar by ID', () => {
    const group = groups.getById('group-1')!;
    const barData = {
      id: 'bar-1',
      group,
      start: '2023-10-01T00:00:00Z',
      end: '2023-10-02T00:00:00Z',
      config,
      layoutConfig,
      groups,
      attachedBars,
      bus
    };
    attachedBars.add(barData);
    attachedBars.removeById('bar-1');

    expect(attachedBars.getById('bar-1')).toBeUndefined();
    expect(groups.getById('group-1')!.attachedBars.getById('bar-1')).toBeUndefined();
  });

  it('should update show status based on group visibility', () => {
    const group = groups.getById('group-1')!;
    group.isShow = false;

    const barData = {
      id: 'bar-1',
      group,
      start: '2023-10-01T00:00:00Z',
      end: '2023-10-02T00:00:00Z',
      config,
      layoutConfig,
      groups,
      attachedBars,
      bus
    };
    attachedBars.add(barData);
    attachedBars.updateShow();

    expect(attachedBars.getById('bar-1')!.isShow).toBe(false);
  });

  it('should calculate all bars', () => {
    const group = groups.getById('group-1')!;
    const barData = {
      id: 'bar-1',
      group,
      start: '2023-10-01T00:00:00Z',
      end: '2023-10-02T00:00:00Z',
      config,
      layoutConfig,
      groups,
      attachedBars,
      bus
    };
    const spyCalculate = jest.spyOn(GanttAttachedBarView.prototype, 'calculate');

    attachedBars.add(barData);
    attachedBars.calculate();

    expect(spyCalculate).toHaveBeenCalled();
  });

  it('should update Y positions for specified groups', () => {
    const group = groups.getById('group-1')!;
    const barData = {
      id: 'bar-1',
      group,
      start: '2023-10-01T00:00:00Z',
      end: '2023-10-02T00:00:00Z',
      config,
      layoutConfig,
      groups,
      attachedBars,
      bus
    };
    const spyChangeY = jest.spyOn(GanttAttachedBarView.prototype, 'changeY');

    attachedBars.add(barData);
    attachedBars.updateBarsYByGroupIds(['group-1']);

    expect(spyChangeY).toHaveBeenCalled();
  });

  it('should handle group expand/collapse changes correctly', () => {
    groups.expandedGroups[0].isShow = true;
    groups.expandedGroups[1].isShow = true;

    const group = groups.getById('group-1')!;
    const barData = {
      id: 'bar-1',
      group,
      start: '2023-10-01T00:00:00Z',
      end: '2023-10-02T00:00:00Z',
      config,
      layoutConfig,
      groups,
      attachedBars,
      bus
    };
    const bar = new GanttAttachedBarView(barData);
    group.attachedBars = {
      filter: () => [],
      getIds: () => ['bar-1'],
      forEach: (cb: any) => cb(bar),
      getById: () => bar
    };

    const spyCalculate = jest.spyOn(bar, 'calculate');
    const spyChangeY = jest.spyOn(bar, 'changeY');

    const effectIds = attachedBars.updateGroupExpandChangeEffectBar(['group-1']);

    expect(effectIds).toContain('bar-1');
    expect(spyCalculate).toHaveBeenCalled();
    expect(spyChangeY).toHaveBeenCalled();
  });

  it('should throw error when calling unsupported array methods', () => {
    expect(() => attachedBars.push({} as any)).toThrowError('Method not implemented.');
    expect(() => attachedBars.pop()).toThrowError('Method not implemented.');
    expect(() => attachedBars.shift()).toThrowError('Method not implemented.');
    expect(() => attachedBars.unshift({} as any)).toThrowError('Method not implemented.');
    expect(() => attachedBars.splice(0, 0, {} as any)).toThrowError('Method not implemented.');
  });

  it('should serialize to JSON correctly', () => {
    const group = groups.getById('group-1')!;
    const barData = {
      id: 'bar-1',
      group,
      start: '2023-10-01T00:00:00Z',
      end: '2023-10-02T00:00:00Z',
      config,
      layoutConfig,
      groups,
      attachedBars,
      bus
    };
    const bar = new GanttAttachedBarView(barData);
    attachedBars.add(barData);

    const json = attachedBars.toJSON();

    expect(json).toEqual([
      {
        id: 'bar-1',
        start: '2023-10-01T00:00:00Z',
        end: '2023-10-02T00:00:00Z',
        groupId: 'group-1'
      }
    ]);
  });

  it('should listen to SHOW_CHANGE event and call updateShow', () => {
    const spyUpdateShow = jest.spyOn(attachedBars, 'updateShow');
    bus.emit(GanttBusEvents.SHOW_CHANGE, {});
    expect(spyUpdateShow).toHaveBeenCalled();
  });

  it('should handle GROUP_BARS_HEIGHT_CHANGE event', () => {
    const data = { groupId: 'group-1' };
    const spyEmit = jest.spyOn(bus, 'emit');

    // 给 group-1 添加一个 attachedBar
    const group = groups.getById('group-1')!;
    const barData = {
      id: 'bar-1',
      group,
      start: '2023-10-01T00:00:00Z',
      end: '2023-10-02T00:00:00Z',
      config,
      layoutConfig,
      groups,
      attachedBars,
      bus
    };
    const bar = new GanttAttachedBarView(barData);
    group.attachedBars.push(bar); // 添加 bar 到 attachedBars
    expect(groups.getById('group-1')!.attachedBars.length).toBe(1);

    // 触发事件
    bus.emit(GanttBusEvents.GROUP_BARS_HEIGHT_CHANGE, data);

    // 确保监听器执行完毕
    // jest.runAllTicks();

    // 验证是否 emit ATTACHED_BAR_CHANGE 并传递 ['bar-1']
    expect(spyEmit).toHaveBeenCalledWith(GanttBusEvents.ATTACHED_BAR_CHANGE, ['bar-1']);
  });
  
  it('should handle GROUP_TOP_CHANGE event', () => {
    const spyUpdateBarsY = jest.spyOn(attachedBars, 'updateBarsYByGroupIds');
    bus.emit(GanttBusEvents.GROUP_TOP_CHANGE, ['group-1']);
    expect(spyUpdateBarsY).toHaveBeenCalledWith(['group-1']);
  });

  it('should handle GROUPS_CHANGE event', () => {
    const data = {
      addGroupIds: [],
      deleteGroupIds: ['group-1']
    };
    const spyUpdateShow = jest.spyOn(attachedBars, 'updateShow');
    const spyUpdateEffectBar = jest.spyOn(attachedBars, 'updateGroupExpandChangeEffectBar');
    const spyEmit = jest.spyOn(bus, 'emit');

    bus.emit(GanttBusEvents.GROUPS_CHANGE, data);
    expect(spyUpdateShow).toHaveBeenCalled();
    expect(spyUpdateEffectBar).toHaveBeenCalledWith(['group-1']);
    expect(spyEmit).toHaveBeenCalledWith(GanttBusEvents.ATTACHED_BAR_CHANGE, []);
  });
});