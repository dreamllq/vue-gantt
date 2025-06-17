import { GanttGroup } from '@/models/gantt-group';

describe('gantt-group', () => {
  test('初始化', () => {
    const gg = new GanttGroup({
      id: 1,
      parent: null
    });

    expect(gg.id).toBe(1);
    expect(gg.children.length).toBe(0);
    expect(gg.parent).toBe(null);
  });
  
  test('一级 1-2', () => {
    const gg1 = new GanttGroup({ id: 1 });
    const gg2 = new GanttGroup({
      id: 2,
      parent: gg1 
    });

    expect(gg1.children.length).toBe(1);
    expect(gg1.children[0].id).toBe(gg2.id);
    expect(gg2.parent?.id).toBe(gg1.id);
  });

  test('parent set null', () => {
    const gg1 = new GanttGroup({ id: 1 });
    const gg2 = new GanttGroup({ id: 2 });

    gg2.parent = gg1;

    expect(gg1.children.length).toBe(1);
    expect(gg1.children[0].id).toBe(gg2.id);
    expect(gg2.parent.id).toBe(gg1.id);

    gg2.parent = null;

    expect(gg1.children.length).toBe(0);

    gg2.parent = gg1;

    expect(gg1.children.length).toBe(1);
    expect(gg1.children[0].id).toBe(gg2.id);
    expect(gg2.parent.id).toBe(gg1.id);
  });
});