import { GanttBar } from '@/models/gantt-bar';
import { GanttBars } from '@/models/gantt-bars';
import { GanttBus } from '@/models/gantt-bus';
import { GanttConfig } from '@/models/gantt-config';
import { GanttGroup } from '@/models/gantt-group';
import { GanttGroups } from '@/models/gantt-groups';
import { GanttLayoutConfig } from '@/models/gantt-layout-config';
import { GanttLinks } from '@/models/gantt-links';

describe('gantt-links 合并', () => {
  const layoutConfig = new GanttLayoutConfig({ });
  const config = new GanttConfig({
    endDate: '',
    layoutConfig,
    startDate: ''
  });
  const bus = new GanttBus();
  const groups = new GanttGroups({
    config,
    layoutConfig
  });
  const bars = new GanttBars({
    config,
    layoutConfig,
    bus,
    groups
  });
  const group = new GanttGroup({
    config,
    layoutConfig,
    id: 'g1',
    parent: null,
    workTimes: []
  });

  const link = new GanttLinks();

  link.add({
    id: 'l1',
    config,
    layoutConfig,
    bars,
    source: new GanttBar({
      config,
      layoutConfig,
      id: 'b1',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    }),
    target: new GanttBar({
      config,
      layoutConfig,
      id: 'b2',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    })
  });

  link.add({
    id: 'l2',
    config,
    layoutConfig,
    bars,
    source: new GanttBar({
      config,
      layoutConfig,
      id: 'b2',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    }),
    target: new GanttBar({
      config,
      layoutConfig,
      id: 'b3',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    })
  });

  link.add({
    id: 'l3',
    config,
    layoutConfig,
    bars,
    source: new GanttBar({
      config,
      layoutConfig,
      id: 'b4',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    }),
    target: new GanttBar({
      config,
      layoutConfig,
      id: 'b5',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    })
  });

  link.add({
    id: 'l4',
    config,
    layoutConfig,
    bars,
    source: new GanttBar({
      config,
      layoutConfig,
      id: 'b5',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    }),
    target: new GanttBar({
      config,
      layoutConfig,
      id: 'b3',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    })
  });

  test('calculateStartLinks', () => {
    const links = link.calculateStartLinks();
    expect(links.length).toBe(2);
    expect(links.some(item => item.id === 'l3')).toBe(true);
    expect(links.some(item => item.id === 'l1')).toBe(true);
    expect(links.some(item => item.id === 'l2')).toBe(false);
  });

  test('calculateLinkGroupMap', () => {
    link.calculateLinkGroupMap();
    expect(Object.keys(link.linkGroupMap).length).toBe(1);
    const key = Object.keys(link.linkGroupMap)[0];
    expect(link.linkGroupMap[key].length).toBe(4);
    expect(link.linkGroupMap[key].some(item => item.id === 'l4')).toBe(true);
    expect(link.linkGroupMap[key].some(item => item.id === 'l1')).toBe(true);
    expect(link.linkGroupMap[key].some(item => item.id === 'l2')).toBe(true);
    expect(link.linkGroupMap[key].some(item => item.id === 'l3')).toBe(true);
  });
});

describe('gantt-links 合并2', () => {
  const layoutConfig = new GanttLayoutConfig({ });
  const config = new GanttConfig({
    endDate: '',
    layoutConfig,
    startDate: ''
  });
  const bus = new GanttBus();
  const groups = new GanttGroups({
    config,
    layoutConfig
  });
  const bars = new GanttBars({
    config,
    layoutConfig,
    bus,
    groups
  });
  const group = new GanttGroup({
    config,
    layoutConfig,
    id: 'g1',
    parent: null,
    workTimes: []
  });

  const link = new GanttLinks();

  link.add({
    id: 'l1',
    config,
    layoutConfig,
    bars,
    source: new GanttBar({
      config,
      layoutConfig,
      id: 'b1',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    }),
    target: new GanttBar({
      config,
      layoutConfig,
      id: 'b2',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    })
  });

  link.add({
    id: 'l2',
    config,
    layoutConfig,
    bars,
    source: new GanttBar({
      config,
      layoutConfig,
      id: 'b2',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    }),
    target: new GanttBar({
      config,
      layoutConfig,
      id: 'b3',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    })
  });

  link.add({
    id: 'l3',
    config,
    layoutConfig,
    bars,
    source: new GanttBar({
      config,
      layoutConfig,
      id: 'b4',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    }),
    target: new GanttBar({
      config,
      layoutConfig,
      id: 'b5',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    })
  });

  link.add({
    id: 'l4',
    config,
    layoutConfig,
    bars,
    source: new GanttBar({
      config,
      layoutConfig,
      id: 'b5',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    }),
    target: new GanttBar({
      config,
      layoutConfig,
      id: 'b3',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    })
  });

  link.add({
    id: 'l5',
    config,
    layoutConfig,
    bars,
    source: new GanttBar({
      config,
      layoutConfig,
      id: 'b3',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    }),
    target: new GanttBar({
      config,
      layoutConfig,
      id: 'b6',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    })
  });

  test('calculateStartLinks', () => {
    const links = link.calculateStartLinks();
    expect(links.length).toBe(2);
    expect(links.some(item => item.id === 'l3')).toBe(true);
    expect(links.some(item => item.id === 'l1')).toBe(true);
    expect(links.some(item => item.id === 'l2')).toBe(false);
  });

  test('calculateLinkGroupMap', () => {
    link.calculateLinkGroupMap();
    expect(Object.keys(link.linkGroupMap).length).toBe(1);
    const key = Object.keys(link.linkGroupMap)[0];
    expect(link.linkGroupMap[key].length).toBe(5);
    expect(link.linkGroupMap[key].some(item => item.id === 'l4')).toBe(true);
    expect(link.linkGroupMap[key].some(item => item.id === 'l1')).toBe(true);
    expect(link.linkGroupMap[key].some(item => item.id === 'l2')).toBe(true);
    expect(link.linkGroupMap[key].some(item => item.id === 'l3')).toBe(true);
    expect(link.linkGroupMap[key].some(item => item.id === 'l5')).toBe(true);
  });
});

describe('gantt-links 分叉', () => {
  const layoutConfig = new GanttLayoutConfig({ });
  const config = new GanttConfig({
    endDate: '',
    layoutConfig,
    startDate: ''
  });
  const bus = new GanttBus();
  const groups = new GanttGroups({
    config,
    layoutConfig
  });
  const bars = new GanttBars({
    config,
    layoutConfig,
    bus,
    groups
  });
  const group = new GanttGroup({
    config,
    layoutConfig,
    id: 'g1',
    parent: null,
    workTimes: []
  });

  const link = new GanttLinks();

  link.add({
    id: 'l1',
    config,
    layoutConfig,
    bars,
    source: new GanttBar({
      config,
      layoutConfig,
      id: 'b1',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    }),
    target: new GanttBar({
      config,
      layoutConfig,
      id: 'b2',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    })
  });

  link.add({
    id: 'l2',
    config,
    layoutConfig,
    bars,
    source: new GanttBar({
      config,
      layoutConfig,
      id: 'b2',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    }),
    target: new GanttBar({
      config,
      layoutConfig,
      id: 'b3',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    })
  });

  link.add({
    id: 'l3',
    config,
    layoutConfig,
    bars,
    source: new GanttBar({
      config,
      layoutConfig,
      id: 'b3',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    }),
    target: new GanttBar({
      config,
      layoutConfig,
      id: 'b4',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    })
  });

  link.add({
    id: 'l4',
    config,
    layoutConfig,
    bars,
    source: new GanttBar({
      config,
      layoutConfig,
      id: 'b2',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    }),
    target: new GanttBar({
      config,
      layoutConfig,
      id: 'b5',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    })
  });

  test('calculateStartLinks', () => {
    const links = link.calculateStartLinks();
    expect(links.length).toBe(1);
    expect(links.some(item => item.id === 'l4')).toBe(false);
    expect(links.some(item => item.id === 'l1')).toBe(true);
    expect(links.some(item => item.id === 'l2')).toBe(false);
  });

  test('calculateLinkGroupMap', () => {
    link.calculateLinkGroupMap();
    expect(Object.keys(link.linkGroupMap).length).toBe(1);
    const key = Object.keys(link.linkGroupMap)[0];
    expect(link.linkGroupMap[key].length).toBe(4);
    expect(link.linkGroupMap[key].some(item => item.id === 'l4')).toBe(true);
    expect(link.linkGroupMap[key].some(item => item.id === 'l1')).toBe(true);
    expect(link.linkGroupMap[key].some(item => item.id === 'l2')).toBe(true);
    expect(link.linkGroupMap[key].some(item => item.id === 'l3')).toBe(true);
  });
});

describe('gantt-links 分叉2', () => {
  const layoutConfig = new GanttLayoutConfig({ });
  const config = new GanttConfig({
    endDate: '',
    layoutConfig,
    startDate: ''
  });
  const bus = new GanttBus();
  const groups = new GanttGroups({
    config,
    layoutConfig
  });
  const bars = new GanttBars({
    config,
    layoutConfig,
    bus,
    groups
  });
  const group = new GanttGroup({
    config,
    layoutConfig,
    id: 'g1',
    parent: null,
    workTimes: []
  });

  const link = new GanttLinks();

  link.add({
    id: 'l1',
    config,
    layoutConfig,
    bars,
    source: new GanttBar({
      config,
      layoutConfig,
      id: 'b1',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    }),
    target: new GanttBar({
      config,
      layoutConfig,
      id: 'b2',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    })
  });

  link.add({
    id: 'l2',
    config,
    layoutConfig,
    bars,
    source: new GanttBar({
      config,
      layoutConfig,
      id: 'b2',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    }),
    target: new GanttBar({
      config,
      layoutConfig,
      id: 'b3',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    })
  });

  link.add({
    id: 'l3',
    config,
    layoutConfig,
    bars,
    source: new GanttBar({
      config,
      layoutConfig,
      id: 'b1',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    }),
    target: new GanttBar({
      config,
      layoutConfig,
      id: 'b4',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    })
  });

  link.add({
    id: 'l4',
    config,
    layoutConfig,
    bars,
    source: new GanttBar({
      config,
      layoutConfig,
      id: 'b4',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    }),
    target: new GanttBar({
      config,
      layoutConfig,
      id: 'b5',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    })
  });

  test('calculateStartLinks', () => {
    const links = link.calculateStartLinks();
    expect(links.length).toBe(2);
    expect(links.some(item => item.id === 'l4')).toBe(false);
    expect(links.some(item => item.id === 'l1')).toBe(true);
    expect(links.some(item => item.id === 'l3')).toBe(true);
    expect(links.some(item => item.id === 'l2')).toBe(false);
  });

  test('calculateLinkGroupMap', () => {
    link.calculateLinkGroupMap();
    expect(Object.keys(link.linkGroupMap).length).toBe(1);
    const key = Object.keys(link.linkGroupMap)[0];
    expect(link.linkGroupMap[key].length).toBe(4);
    expect(link.linkGroupMap[key].some(item => item.id === 'l4')).toBe(true);
    expect(link.linkGroupMap[key].some(item => item.id === 'l1')).toBe(true);
    expect(link.linkGroupMap[key].some(item => item.id === 'l2')).toBe(true);
    expect(link.linkGroupMap[key].some(item => item.id === 'l3')).toBe(true);
  });
});



describe('gantt-links 多条单链', () => {
  const layoutConfig = new GanttLayoutConfig({ });
  const config = new GanttConfig({
    endDate: '',
    layoutConfig,
    startDate: ''
  });
  const bus = new GanttBus();
  const groups = new GanttGroups({
    config,
    layoutConfig
  });
  const bars = new GanttBars({
    config,
    layoutConfig,
    bus,
    groups
  });
  const group = new GanttGroup({
    config,
    layoutConfig,
    id: 'g1',
    parent: null,
    workTimes: []
  });

  const link = new GanttLinks();

  link.add({
    id: 'l1',
    config,
    layoutConfig,
    bars,
    source: new GanttBar({
      config,
      layoutConfig,
      id: 'b1',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    }),
    target: new GanttBar({
      config,
      layoutConfig,
      id: 'b2',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    })
  });

  link.add({
    id: 'l2',
    config,
    layoutConfig,
    bars,
    source: new GanttBar({
      config,
      layoutConfig,
      id: 'b2',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    }),
    target: new GanttBar({
      config,
      layoutConfig,
      id: 'b3',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    })
  });

  link.add({
    id: 'l3',
    config,
    layoutConfig,
    bars,
    source: new GanttBar({
      config,
      layoutConfig,
      id: 'b4',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    }),
    target: new GanttBar({
      config,
      layoutConfig,
      id: 'b5',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    })
  });

  link.add({
    id: 'l4',
    config,
    layoutConfig,
    bars,
    source: new GanttBar({
      config,
      layoutConfig,
      id: 'b5',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    }),
    target: new GanttBar({
      config,
      layoutConfig,
      id: 'b6',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    })
  });

  test('calculateStartLinks', () => {
    const links = link.calculateStartLinks();
    expect(links.length).toBe(2);
    expect(links.some(item => item.id === 'l1')).toBe(true);
    expect(links.some(item => item.id === 'l3')).toBe(true);
    expect(links.some(item => item.id === 'l2')).toBe(false);
    expect(links.some(item => item.id === 'l4')).toBe(false);
  });

  test('calculateLinkGroupMap', () => {
    link.calculateLinkGroupMap();
    expect(Object.keys(link.linkGroupMap).length).toBe(2);

    Object.keys(link.linkGroupMap).forEach(key => {
      if (link.linkGroupMap[key].some(item => item.id === 'l1')) {
        expect(link.linkGroupMap[key].some(item => item.id === 'l2')).toBe(true);
      }

      if (link.linkGroupMap[key].some(item => item.id === 'l3')) {
        expect(link.linkGroupMap[key].some(item => item.id === 'l4')).toBe(true);
      }
    });
  });
});

describe('gantt-links 菱形', () => {
  const layoutConfig = new GanttLayoutConfig({ });
  const config = new GanttConfig({
    endDate: '',
    layoutConfig,
    startDate: ''
  });
  const bus = new GanttBus();
  const groups = new GanttGroups({
    config,
    layoutConfig
  });
  const bars = new GanttBars({
    config,
    layoutConfig,
    bus,
    groups
  });
  const group = new GanttGroup({
    config,
    layoutConfig,
    id: 'g1',
    parent: null,
    workTimes: []
  });

  const link = new GanttLinks();

  link.add({
    id: 'l1',
    config,
    layoutConfig,
    bars,
    source: new GanttBar({
      config,
      layoutConfig,
      id: 'b1',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    }),
    target: new GanttBar({
      config,
      layoutConfig,
      id: 'b2',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    })
  });

  link.add({
    id: 'l2',
    config,
    layoutConfig,
    bars,
    source: new GanttBar({
      config,
      layoutConfig,
      id: 'b1',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    }),
    target: new GanttBar({
      config,
      layoutConfig,
      id: 'b3',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    })
  });

  link.add({
    id: 'l3',
    config,
    layoutConfig,
    bars,
    source: new GanttBar({
      config,
      layoutConfig,
      id: 'b2',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    }),
    target: new GanttBar({
      config,
      layoutConfig,
      id: 'b4',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    })
  });

  link.add({
    id: 'l4',
    config,
    layoutConfig,
    bars,
    source: new GanttBar({
      config,
      layoutConfig,
      id: 'b3',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    }),
    target: new GanttBar({
      config,
      layoutConfig,
      id: 'b4',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    })
  });

  test('calculateStartLinks', () => {
    const links = link.calculateStartLinks();
    expect(links.length).toBe(2);
    expect(links.some(item => item.id === 'l1')).toBe(true);
    expect(links.some(item => item.id === 'l2')).toBe(true);
    expect(links.some(item => item.id === 'l3')).toBe(false);
    expect(links.some(item => item.id === 'l4')).toBe(false);
  });

  test('calculateLinkGroupMap', () => {
    link.calculateLinkGroupMap();
    expect(Object.keys(link.linkGroupMap).length).toBe(1);
    const key = Object.keys(link.linkGroupMap)[0];
    expect(link.linkGroupMap[key].length).toBe(4);
    expect(link.linkGroupMap[key].some(item => item.id === 'l4')).toBe(true);
    expect(link.linkGroupMap[key].some(item => item.id === 'l1')).toBe(true);
    expect(link.linkGroupMap[key].some(item => item.id === 'l2')).toBe(true);
    expect(link.linkGroupMap[key].some(item => item.id === 'l3')).toBe(true);
  });
});

describe('gantt-links 菱形', () => {
  const layoutConfig = new GanttLayoutConfig({ });
  const config = new GanttConfig({
    endDate: '',
    layoutConfig,
    startDate: ''
  });
  const bus = new GanttBus();
  const groups = new GanttGroups({
    config,
    layoutConfig
  });
  const bars = new GanttBars({
    config,
    layoutConfig,
    bus,
    groups
  });
  const group = new GanttGroup({
    config,
    layoutConfig,
    id: 'g1',
    parent: null,
    workTimes: []
  });

  const link = new GanttLinks();

  link.add({
    id: 'l1',
    config,
    layoutConfig,
    bars,
    source: new GanttBar({
      config,
      layoutConfig,
      id: 'b1',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    }),
    target: new GanttBar({
      config,
      layoutConfig,
      id: 'b2',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    })
  });

  link.add({
    id: 'l2',
    config,
    layoutConfig,
    bars,
    source: new GanttBar({
      config,
      layoutConfig,
      id: 'b1',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    }),
    target: new GanttBar({
      config,
      layoutConfig,
      id: 'b3',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    })
  });

  link.add({
    id: 'l3',
    config,
    layoutConfig,
    bars,
    source: new GanttBar({
      config,
      layoutConfig,
      id: 'b2',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    }),
    target: new GanttBar({
      config,
      layoutConfig,
      id: 'b4',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    })
  });

  link.add({
    id: 'l4',
    config,
    layoutConfig,
    bars,
    source: new GanttBar({
      config,
      layoutConfig,
      id: 'b3',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    }),
    target: new GanttBar({
      config,
      layoutConfig,
      id: 'b4',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    })
  });

  link.add({
    id: 'l5',
    config,
    layoutConfig,
    bars,
    source: new GanttBar({
      config,
      layoutConfig,
      id: 'b4',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    }),
    target: new GanttBar({
      config,
      layoutConfig,
      id: 'b5',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    })
  });

  link.add({
    id: 'l6',
    config,
    layoutConfig,
    bars,
    source: new GanttBar({
      config,
      layoutConfig,
      id: 'b6',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    }),
    target: new GanttBar({
      config,
      layoutConfig,
      id: 'b1',
      start: '2024-01-01 01:01:00',
      duration: 10,
      end: null,
      group: group
    })
  });

  test('calculateStartLinks', () => {
    const links = link.calculateStartLinks();
    expect(links.length).toBe(1);
    expect(links.some(item => item.id === 'l1')).toBe(false);
    expect(links.some(item => item.id === 'l2')).toBe(false);
    expect(links.some(item => item.id === 'l3')).toBe(false);
    expect(links.some(item => item.id === 'l4')).toBe(false);
    expect(links.some(item => item.id === 'l6')).toBe(true);
  });

  test('calculateLinkGroupMap', () => {
    link.calculateLinkGroupMap();
    expect(Object.keys(link.linkGroupMap).length).toBe(1);
    const key = Object.keys(link.linkGroupMap)[0];
    expect(link.linkGroupMap[key].length).toBe(6);
    expect(link.linkGroupMap[key].some(item => item.id === 'l4')).toBe(true);
    expect(link.linkGroupMap[key].some(item => item.id === 'l1')).toBe(true);
    expect(link.linkGroupMap[key].some(item => item.id === 'l2')).toBe(true);
    expect(link.linkGroupMap[key].some(item => item.id === 'l3')).toBe(true);
    expect(link.linkGroupMap[key].some(item => item.id === 'l5')).toBe(true);
    expect(link.linkGroupMap[key].some(item => item.id === 'l6')).toBe(true);
  });
});