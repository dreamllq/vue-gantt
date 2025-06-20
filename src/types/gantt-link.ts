import { GanttBar } from '@/models/gantt-bar';
import { Id } from './id';
import { GanttBaseClassConstructor } from './gantt-base';
import { GanttBars } from '@/models/gantt-bars';
import { GanttLayoutConfig } from '@/models/gantt-layout-config';

export type GanttLinkViewClassConstructor = GanttLinkClassConstructor & {bars: GanttBars}

export type GanttLinkClassConstructor = {
  id: Id;
  source: GanttBar;
  target: GanttBar;
  linkType?: GanttLinkType;
} & GanttBaseClassConstructor;

export type GanttLinkAddParams = {
  id: Id;
  source: GanttBar;
  target: GanttBar;
  linkType?: GanttLinkType;
}

export enum GanttLinkType {
  FINISH_TO_START = 'FINISH_TO_START',
  START_TO_START = 'START_TO_START',
  FINISH_TO_FINISH = 'FINISH_TO_FINISH',
  START_TO_FINISH = 'START_TO_FINISH',
  START_TO_START_AND_FINISH_TO_FINISH = 'START_TO_START_AND_FINISH_TO_FINISH'
}

export type CalculateProps = {
  sourceY: number,
  targetY: number,
  sourceStartX: number,
  sourceFinishX: number,
  targetStartX: number,
  targetFinishX: number,
  layoutConfig: GanttLayoutConfig
}

export enum ArrowDirection {
  LEFT='left', RIGHT='right'
}
export type LinkPathPoint = {x: number, y: number};
export type LinkPath = LinkPathPoint[]
export type Arrow = {direction: ArrowDirection, point: LinkPathPoint}
export type LinkData = {path: LinkPath, arrow: Arrow}

export enum LinkShowStrategy {
  NONE,
  ALL,
  SELECTED,
  SELECTED_All,
  CUSTOMIZE
}