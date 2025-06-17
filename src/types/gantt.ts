import { GanttConfig } from '@/models/gantt-config';
import { DateString, DateTimeString, SplitTimeString } from './date';
import { Id } from './id';
import { Unit } from './unit';
import { GanttLayoutConfig } from '@/models/gantt-layout-config';
import { GanttLayoutConfigClassConstructor } from './gantt-layout-config';
import { GanttLinkType } from './gantt-link';

export type GanttClassConstructor = { config: GanttConfig, layoutConfig: GanttLayoutConfig}

export type GanttJsonDataConfig = {
  startDate: DateString,
  endDate: DateString,
  daySplitTime?: SplitTimeString,
  durationUnit?: keyof typeof Unit,
  dataScaleUnit?: keyof typeof Unit
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
  workTimes?:GanttJsonDataGroupWorkTime[]
};

export type GanttJsonDataBar = {
  id: Id,
  groupId:Id,
  start: DateTimeString | null,
  end: DateTimeString | null,
  duration: number | null
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