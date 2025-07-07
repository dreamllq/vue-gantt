import { GanttJsonData, GanttJsonDataBar, GanttJsonDataGroup, GanttJsonDataGroupWorkTime, GanttJsonDataLink, GanttJsonDataWorkTime } from '@/index.ts';
import moment, { Moment } from 'moment';

const makeWorkTimes = (start:Moment, end:Moment): GanttJsonDataGroupWorkTime[] => {
  const temp = start.clone();
  const workTimes:GanttJsonDataGroupWorkTime[] = [];
  while (!temp.isAfter(end)) {
    const dateStr = temp.format('YYYY-MM-DD');
    workTimes.push({
      start: `${dateStr} 02:00:00`,
      end: `${dateStr} 06:00:00`
    });
    workTimes.push({
      start: `${dateStr} 08:00:00`,
      end: `${dateStr} 12:00:00`
    });
    workTimes.push({
      start: `${dateStr} 14:00:00`,
      end: `${dateStr} 18:00:00`
    });
    workTimes.push({
      start: `${dateStr} 20:00:00`,
      end: `${dateStr} 24:00:00`
    });
    temp.add(1, 'd');
  }

  return workTimes;
};

export const getData = ():GanttJsonData => {
  const groupCount = 10;
  const orderCount = 5000;
  const startDate = moment();
  const endDate = moment().add(3, 'year');
  const workTimesTemp = makeWorkTimes(startDate, endDate);

  const groups:GanttJsonDataGroup[] = [];
  for (let i = 0; i < groupCount; i++) {
    groups.push({
      id: `g_${i + 1}`,
      barOverlap: false
    });
  }
  const workTimes:GanttJsonDataWorkTime[] = [];
  for (let i = 0; i < groupCount; i++) {
    workTimesTemp.forEach((workTime, index) => {
      workTimes.push({
        id: `g_${i + 1}_w_${index + 1}`,
        groupId: `g_${i + 1}`,
        start: workTime.start,
        end: workTime.end
      });
    });
  }

 

  const bars: GanttJsonDataBar[] = [];
  const links:GanttJsonDataLink[] = [];
  let barId = 1;
  let linkId = 1;

  const orderTempDate = startDate.clone().startOf('day');
  for (let i = 0; i < orderCount; i++) {
    const tempDate = orderTempDate.clone();
    tempDate.add(2, 'h');
    bars.push({
      id: `b_${barId}`,
      duration: 4 * 60 * 60,
      groupId: 'g_1',
      start: `${tempDate.format('YYYY-MM-DD HH:mm:ss')}`,
      end: `${tempDate.add(4, 'h').format('YYYY-MM-DD HH:mm:ss')}`
    });
    tempDate.add(2, 'h');
    barId++;
    bars.push({
      id: `b_${barId}`,
      duration: 4 * 60 * 60,
      groupId: 'g_2',
      start: `${tempDate.format('YYYY-MM-DD HH:mm:ss')}`,
      end: `${tempDate.add(4, 'h').format('YYYY-MM-DD HH:mm:ss')}`
    });
    tempDate.add(2, 'h');
    links.push({
      id: `l_${linkId}`,
      sourceId: `b_${barId - 1}`,
      targetId: `b_${barId}`
    });
    barId++;
    linkId++;

    bars.push({
      id: `b_${barId}`,
      duration: 4 * 60 * 60,
      groupId: 'g_3',
      start: `${tempDate.format('YYYY-MM-DD HH:mm:ss')}`,
      end: `${tempDate.add(4, 'h').format('YYYY-MM-DD HH:mm:ss')}`
    });
    tempDate.add(2, 'h');
    links.push({
      id: `l_${linkId}`,
      sourceId: `b_${barId - 1}`,
      targetId: `b_${barId}`
    });
    linkId++;
    barId++;
    bars.push({
      id: `b_${barId}`,
      duration: 4 * 60 * 60,
      groupId: 'g_4',
      start: `${tempDate.format('YYYY-MM-DD HH:mm:ss')}`,
      end: `${tempDate.add(4, 'h').format('YYYY-MM-DD HH:mm:ss')}`
    });
    tempDate.add(2, 'h');
    links.push({
      id: `l_${linkId}`,
      sourceId: `b_${barId - 1}`,
      targetId: `b_${barId}`
    });
    barId++;
    linkId++;

    // 下一天
    bars.push({
      id: `b_${barId}`,
      duration: 4 * 60 * 60,
      groupId: 'g_5',
      start: `${tempDate.format('YYYY-MM-DD HH:mm:ss')}`,
      end: `${tempDate.add(4, 'h').format('YYYY-MM-DD HH:mm:ss')}`
    });
    tempDate.add(2, 'h');
    links.push({
      id: `l_${linkId}`,
      sourceId: `b_${barId - 1}`,
      targetId: `b_${barId}`
    });
    linkId++;
    barId++;
    bars.push({
      id: `b_${barId}`,
      duration: 4 * 60 * 60,
      groupId: 'g_6',
      start: `${tempDate.format('YYYY-MM-DD HH:mm:ss')}`,
      end: `${tempDate.add(4, 'h').format('YYYY-MM-DD HH:mm:ss')}`
    });
    tempDate.add(2, 'h');
    links.push({
      id: `l_${linkId}`,
      sourceId: `b_${barId - 1}`,
      targetId: `b_${barId}`
    });
    barId++;
    linkId++;

    bars.push({
      id: `b_${barId}`,
      duration: 4 * 60 * 60,
      groupId: 'g_7',
      start: `${tempDate.format('YYYY-MM-DD HH:mm:ss')}`,
      end: `${tempDate.add(4, 'h').format('YYYY-MM-DD HH:mm:ss')}`
    });
    tempDate.add(2, 'h');
    links.push({
      id: `l_${linkId}`,
      sourceId: `b_${barId - 1}`,
      targetId: `b_${barId}`
    });
    linkId++;
    barId++;
    bars.push({
      id: `b_${barId}`,
      duration: 4 * 60 * 60,
      groupId: 'g_8',
      start: `${tempDate.format('YYYY-MM-DD HH:mm:ss')}`,
      end: `${tempDate.add(4, 'h').format('YYYY-MM-DD HH:mm:ss')}`
    });
    tempDate.add(2, 'h');
    links.push({
      id: `l_${linkId}`,
      sourceId: `b_${barId - 1}`,
      targetId: `b_${barId}`
    });
    barId++;
    linkId++;


    bars.push({
      id: `b_${barId}`,
      duration: 4 * 60 * 60,
      groupId: 'g_9',
      start: `${tempDate.format('YYYY-MM-DD HH:mm:ss')}`,
      end: `${tempDate.add(4, 'h').format('YYYY-MM-DD HH:mm:ss')}`
    });
    tempDate.add(2, 'h');
    links.push({
      id: `l_${linkId}`,
      sourceId: `b_${barId - 1}`,
      targetId: `b_${barId}`
    });
    barId++;
    linkId++;

    bars.push({
      id: `b_${barId}`,
      duration: 4 * 60 * 60,
      groupId: 'g_10',
      start: `${tempDate.format('YYYY-MM-DD HH:mm:ss')}`,
      end: `${tempDate.add(4, 'h').format('YYYY-MM-DD HH:mm:ss')}`
    });
    tempDate.add(2, 'h');
    links.push({
      id: `l_${linkId}`,
      sourceId: `b_${barId - 1}`,
      targetId: `b_${barId}`
    });
    barId++;
    linkId++;

    orderTempDate.add(6, 'h');
  }
  
  
  return {
    'config': {
      'startDate': startDate.format('YYYY-MM-DD'),
      'endDate': endDate.format('YYYY-MM-DD'),
      'durationUnit': 'SECOND',
      'draggable': true,
      'selectable': true,
      'multipleSelectable': true,
      'contextMenuEnable': true,
      'linkShowStrategy': 'SELECTED_ALL',
      dragTimeOffset: 0,
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
    'groups': groups,
    workTimes: workTimes,
    'bars': bars,
    'links': links
  };
};