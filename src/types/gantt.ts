import { GanttConfig } from '@/models/gantt-config';
import { DateString, DateTimeString, SplitTimeString } from './date';
import { Id } from './id';
import { Unit } from './unit';
import { GanttLayoutConfig } from '@/models/gantt-layout-config';
import { GanttLayoutConfigClassConstructor } from './gantt-layout-config';
import { GanttLinkType, LinkShowStrategy } from './gantt-link';
import { SchedulingMode } from './gantt-config';
import { menusItemType } from './contextmenu-menus';

export type GanttClassConstructor = { config: GanttConfig, layoutConfig: GanttLayoutConfig}

export type GanttJsonDataConfig = {
  startDate: DateString,
  endDate: DateString,
  daySplitTime?: SplitTimeString,
  durationUnit?: keyof typeof Unit,
  dataScaleUnit?: keyof typeof Unit,
  lazyDebounceTime?:number,
  schedulingMode?: keyof typeof SchedulingMode,
  draggable?:boolean,
  selectable?:boolean,
  checkable?:boolean,
  multipleDraggable?:boolean,
  contextMenuEnable?:boolean,
  contextMenuMenus?:menusItemType[],
  linkShowStrategy?: keyof typeof LinkShowStrategy
};

export type GanttJsonDataLayoutConfig=GanttLayoutConfigClassConstructor;

export type GanttJsonDataGroupWorkTime = {
  start: DateTimeString;
  end: DateTimeString;
}

export type GanttJsonDataGroup = {
  id: Id, 
  parentId:Id | null, 
  isExpand?: boolean,
  workTimes?:GanttJsonDataGroupWorkTime[],
  barOverlap?: boolean
};

export type GanttJsonDataBar = {
  id: Id,
  groupId:Id,
  start: DateTimeString | null,
  end: DateTimeString | null,
  duration: number | null
  schedulingMode?: keyof typeof SchedulingMode
};

export type GanttJsonDataLink = {
  id: Id,
  sourceId: Id,
  targetId: Id,
  linkType?: keyof typeof GanttLinkType;
};

export type GanttJsonData = {
  config: GanttJsonDataConfig,
  layoutConfig?: GanttJsonDataLayoutConfig,
  groups: GanttJsonDataGroup[],
  bars: GanttJsonDataBar[],
  links: GanttJsonDataLink[]
}
