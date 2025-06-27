import { GanttConfig } from '@/models/gantt-config';
import { DateString, DateTimeString, SplitTimeString } from './date';
import { Id } from './id';
import { Unit } from './unit';
import { GanttLayoutConfig } from '@/models/gantt-layout-config';
import { GanttLayoutConfigClassConstructor } from './gantt-layout-config';
import { GanttLinkType, LinkId, LinkShowStrategy } from './gantt-link';
import { SchedulingMode } from './gantt-config';
import { menusItemType } from './contextmenu-menus';
import { GroupId } from './gantt-group';
import { BarId } from './gantt-bar';

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
  linkShowStrategy?: keyof typeof LinkShowStrategy,
  showCurrentTimeLine?:boolean
};

export type GanttJsonDataLayoutConfig=GanttLayoutConfigClassConstructor;

export type GanttJsonDataGroupWorkTime = {
  start: DateTimeString;
  end: DateTimeString;
}

export type GanttJsonDataGroup = {
  id: GroupId, 
  parentId?: GroupId, 
  isExpand?: boolean,
  workTimes?:GanttJsonDataGroupWorkTime[],
  barOverlap?: boolean
};

export type GanttJsonDataBar = {
  id: BarId,
  groupId:GroupId,
  start: DateTimeString | null,
  end: DateTimeString | null,
  duration: number | null
  schedulingMode?: keyof typeof SchedulingMode
};

export type GanttJsonDataLink = {
  id: LinkId,
  sourceId: BarId,
  targetId: BarId,
  linkType?: keyof typeof GanttLinkType;
};

export type GanttJsonData = {
  config: GanttJsonDataConfig,
  layoutConfig?: GanttJsonDataLayoutConfig,
  groups: GanttJsonDataGroup[],
  bars: GanttJsonDataBar[],
  links: GanttJsonDataLink[]
}
