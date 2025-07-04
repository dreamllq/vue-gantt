import { GanttJsonData } from '@/index.ts';

export const data:GanttJsonData = {
  'config': {
    'endDate': '2025-08-14',
    'startDate': '2024-01-01',
    'durationUnit': 'SECOND',
    'draggable': true,
    'selectable': true,
    'multipleSelectable': true,
    'contextMenuEnable': true,
    'linkShowStrategy': 'ALL',
    contextMenuMenus: [
      {
        label: '返回(B)',
        tip: 'Alt+向左箭头',
        click: (a, b) => {
          console.log(a, b.barId);
        }
      }
    ],
    showCurrentTimeLine: true,
    showAttachedBars: true
  },
  'layoutConfig': {
    'ROW_HEIGHT': 40,
    'BAR_HEIGHT': 30,
    'GRID_CELL_WIDTH': 200
  },
  'groups': [
    {
      'id': 1,
      'workTimes': [
        {
          'start': '2024-01-01 00:00:00',
          'end': '2024-02-01 12:00:00'
        }
      ],
      'barOverlap': true,
      isExpand: false
    },
    {
      'id': 911,
      'parentId': 1,
      'workTimes': [
        {
          'start': '2024-01-01 00:00:00',
          'end': '2024-02-01 12:00:00'
        }
      ],
      'barOverlap': false,
      isExpand: true
    },
    {
      'id': 9111,
      'parentId': 911,
      'workTimes': [
        {
          'start': '2024-01-01 00:00:00',
          'end': '2024-02-01 12:00:00'
        }
      ],
      'barOverlap': true
    },
    {
      'id': 2,
      'workTimes': [
        {
          'start': '2024-01-01 00:00:00',
          'end': '2024-03-01 12:00:00'
        }
      ]
    },
    {
      'id': 3,
      'workTimes': [
        {
          'start': '2024-01-01 00:00:00',
          'end': '2024-02-01 12:00:00'
        }
      ],
      'barOverlap': true
    },
    {
      'id': 4,
      'workTimes': [
        {
          'start': '2024-01-01 00:00:00',
          'end': '2024-02-01 12:00:00'
        }
      ],
      'barOverlap': true
    },
    { 'id': 5 },
    { 'id': 6 },
    { 'id': 7 },
    { 'id': 8 },
    { 'id': 9 },
    { 'id': 10 },
    { 'id': 11 },
    { 'id': 12 }
  ],
  'bars': [
    {
      'duration': 72000,
      'end': null,
      'groupId': 1,
      'id': 1,
      'start': '2024-01-02 00:00:00',
      draggable: false,
      contextMenuEnable: false
    },
    {
      'duration': 72000,
      'end': null,
      'groupId': 2,
      'id': 2,
      'start': '2024-01-02 12:00:00',
      selectable: false
    },
    {
      'duration': 72000,
      'end': null,
      'groupId': 3,
      'id': 3,
      'start': '2024-01-04 04:00:00'
    },
    {
      'duration': 72000,
      'end': null,
      'groupId': 911,
      'id': 4,
      'start': '2024-01-02 00:00:00'
    },
    {
      'duration': 72000,
      'end': null,
      'groupId': 3,
      'id': 5,
      'start': '2024-01-03 02:00:00'
    },
    {
      'duration': 72000,
      'end': null,
      'groupId': 4,
      'id': 6,
      'start': '2024-01-04 04:00:00'
    }
  ],
  attachedBars: [
    {
      groupId: 3,
      id: 1,
      start: '2024-01-02 00:00:00',
      end: '2024-01-02 12:00:00'
    },
    {
      groupId: 2,
      id: 2,
      start: '2024-01-02 00:00:00',
      end: '2024-01-02 12:00:00'
    },
    {
      groupId: 911,
      id: 3,
      start: '2024-01-02 00:00:00',
      end: '2024-01-02 12:00:00'
    }
  ],
  'links': [
    {
      'id': 1,
      'sourceId': 1,
      'targetId': 2
    },
    {
      'id': 2,
      'sourceId': 2,
      'targetId': 3
    },
    {
      'id': 3,
      'sourceId': 4,
      'targetId': 5
    },
    {
      'id': 4,
      'sourceId': 5,
      'targetId': 6
    }
  ], 
  milestones: [
    {
      id: 1,
      datetime: '2024-01-20 14:00:00',
      groupId: 1,
      text: '111'
    },
    {
      id: 2,
      datetime: '2024-01-02 14:00:00',
      groupId: 1,
      text: '111'
    },
    {
      id: 3,
      datetime: '2024-01-20 14:00:00',
      groupId: 911,
      text: '111'
    }
  ],
  hook: {
    beforeDragStart: (data) => true,
    beforeDragEnd: (data) => true
  }
};