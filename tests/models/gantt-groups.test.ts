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

  test('expandedGroups', () => {
    const groups = new GanttGroups({
      config,
      layoutConfig
    });

    const gg1 = new GanttGroupView({
      config,
      id: 1,
      layoutConfig
    });
    const gg2 = new GanttGroupView({
      config,
      id: 2,
      layoutConfig
    });
    const gg3 = new GanttGroupView({
      config,
      id: 3,
      layoutConfig
    });
    const gg11 = new GanttGroupView({
      config,
      id: 11,
      layoutConfig,
      parent: gg1
    });
    const gg111 = new GanttGroupView({
      config,
      id: 111,
      layoutConfig,
      parent: gg11
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