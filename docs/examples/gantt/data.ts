import { GanttJsonData } from '@/index.ts';

export const data:GanttJsonData = {
  'config': {
    'endDate': '2025-08-14',
    'startDate': '2024-01-01',
    'durationUnit': 'SECOND',
    'draggable': true,
    'selectable': true,
    'checkable': true,
    'contextMenuEnable': true,
    'linkShowStrategy': 'SELECTED_ALL',
    contextMenuMenus: [
      {
        label: '返回(B)',
        tip: 'Alt+向左箭头',
        click: (a, b) => {
          console.log(a, b.barId);
        }
      }
    ],
    showCurrentTimeLine: true
  },
  'layoutConfig': {
    'ROW_HEIGHT': 40,
    'BAR_HEIGHT': 30,
    'BAR_CENTER_TOP': 20,
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
      isExpand: true
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
      'barOverlap': true,
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
      'start': '2024-01-02 00:00:00'
    },
    {
      'duration': 72000,
      'end': null,
      'groupId': 2,
      'id': 2,
      'start': '2024-01-02 12:00:00'
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
      'groupId': 2,
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
  ]
};