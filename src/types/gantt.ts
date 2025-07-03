import { GanttConfig } from '@/models/gantt-config';
import { DateString, DateTimeString, SplitTimeString } from './date';
import { Unit } from './unit';
import { GanttLayoutConfig } from '@/models/gantt-layout-config';
import { GanttLayoutConfigClassConstructor } from './gantt-layout-config';
import { GanttLinkType, LinkId, LinkShowStrategy } from './gantt-link';
import { SchedulingMode } from './gantt-config';
import { menusItemType } from './contextmenu-menus';
import { GroupId } from './gantt-group';
import { BarId } from './gantt-bar';
import { AttachedBarId } from './gantt-attached-bar';
import { MilestoneId } from './gantt-milestone';
import { GanttGroup } from '@/models/gantt-group';

export type GanttClassConstructor = { config: GanttConfig, layoutConfig: GanttLayoutConfig, hook?: GanttHook}

export type GanttHook = {
  beforeDragStart?: (data:{barId: BarId}) => boolean,
  beforeDragEnd?: (data:{barId: BarId}) => boolean,
}

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
  multipleSelectable?:boolean,
  multipleDraggable?:boolean,
  contextMenuEnable?:boolean,
  contextMenuMenus?:menusItemType[],
  linkShowStrategy?: keyof typeof LinkShowStrategy,
  showCurrentTimeLine?:boolean,
  showAttachedBars?:boolean,
  dragTimeOffset?:number
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
  schedulingMode?: keyof typeof SchedulingMode,
  selectable?:boolean,
  draggable?:boolean,
  contextMenuEnable?:boolean
};

export type GanttJsonDataAttachedBar = {
  id: AttachedBarId,
  groupId:GroupId,
  start: DateTimeString,
  end: DateTimeString,
}

export type GanttJsonDataLink = {
  id: LinkId,
  sourceId: BarId,
  targetId: BarId,
  linkType?: keyof typeof GanttLinkType;
};

export type GanttJsonDataMilestone = {
  id: MilestoneId;
  groupId: GroupId;
  datetime: DateTimeString;
  text?: string;
}

export type GanttJsonData = {
  config: GanttJsonDataConfig,
  layoutConfig?: GanttJsonDataLayoutConfig,
  groups: GanttJsonDataGroup[],
  bars: GanttJsonDataBar[],
  attachedBars?: GanttJsonDataAttachedBar[],
  links?: GanttJsonDataLink[],
  milestones?: GanttJsonDataMilestone[],
  hook?: GanttHook,
}
