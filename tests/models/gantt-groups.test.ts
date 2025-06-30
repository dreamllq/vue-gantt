import { GanttBus } from '@/models/gantt-bus';
import { GanttConfig } from '@/models/gantt-config';
import { GanttGroupView } from '@/models/gantt-group-view';
import { GanttGroups } from '@/models/gantt-groups';
import { GanttLayoutConfig } from '@/models/gantt-layout-config';

describe('gantt-groups', () => {

  const layoutConfig = new GanttLayoutConfig({ });
  const config = new GanttConfig({
    endDate: '',
    layoutConfig,
    startDate: ''
  });
  const bus = new GanttBus();

  test('expandedGroups', () => {
    const groups = new GanttGroups({
      config,
      layoutConfig,
      bus
    });

    const gg1 = new GanttGroupView({
      config,
      id: 1,
      layoutConfig,
      bus
    });
    const gg2 = new GanttGroupView({
      config,
      id: 2,
      layoutConfig,
      bus
    });
    const gg3 = new GanttGroupView({
      config,
      id: 3,
      layoutConfig,
      bus
    });
    const gg11 = new GanttGroupView({
      config,
      id: 11,
      layoutConfig,
      parent: gg1,
      bus
    });
    const gg111 = new GanttGroupView({
      config,
      id: 111,
      layoutConfig,
      parent: gg11,
      bus
    });

    groups.push(gg1);
    groups.push(gg2);
    groups.push(gg3);
    groups.push(gg11);
    groups.push(gg111);

    groups.calculateExpandedGroups();
    expect(groups.expandedGroups.length).toBe(3);
    expect(groups.expandedGroups.includes(gg1)).toBe(true);
    expect(groups.expandedGroups.includes(gg2)).toBe(true);
    expect(groups.expandedGroups.includes(gg3)).toBe(true);
    expect(groups.expandedGroups.includes(gg11)).toBe(false);
    expect(groups.expandedGroups.includes(gg111)).toBe(false);
    gg1.isExpand = true;
    groups.calculateExpandedGroups();
    expect(groups.expandedGroups.length).toBe(4);
    expect(groups.expandedGroups.includes(gg1)).toBe(true);
    expect(groups.expandedGroups.includes(gg2)).toBe(true);
    expect(groups.expandedGroups.includes(gg3)).toBe(true);
    expect(groups.expandedGroups.includes(gg11)).toBe(true);
    expect(groups.expandedGroups.includes(gg111)).toBe(false);
    gg1.isExpand = false;
    gg11.isExpand = true;
    groups.calculateExpandedGroups();
    expect(groups.expandedGroups.length).toBe(3);
    expect(groups.expandedGroups.includes(gg1)).toBe(true);
    expect(groups.expandedGroups.includes(gg2)).toBe(true);
    expect(groups.expandedGroups.includes(gg3)).toBe(true);
    expect(groups.expandedGroups.includes(gg11)).toBe(false);
    expect(groups.expandedGroups.includes(gg111)).toBe(false);
    gg1.isExpand = true;
    gg11.isExpand = true;
    groups.calculateExpandedGroups();
    expect(groups.expandedGroups.length).toBe(5);
    expect(groups.expandedGroups.includes(gg1)).toBe(true);
    expect(groups.expandedGroups.includes(gg2)).toBe(true);
    expect(groups.expandedGroups.includes(gg3)).toBe(true);
    expect(groups.expandedGroups.includes(gg11)).toBe(true);
    expect(groups.expandedGroups.includes(gg111)).toBe(true);
  });
});