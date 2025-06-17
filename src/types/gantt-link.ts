import { GanttBar } from '@/models/gantt-bar';
import { Id } from './id';
import { GanttBaseClassConstructor } from './gantt-base';

export type GanttLinkViewClassConstructor = GanttLinkClassConstructor

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
  FINISH_TO_START = '0',
  START_TO_START = '1',
  FINISH_TO_FINISH = '2',
  START_TO_FINISH = '3',
  START_TO_START_AND_FINISH_TO_FINISH = '4'
}

export type GanttLinkPoint = {
  x: number;
  y: number;
}

export type GanttLinkPath = GanttLinkPoint[];

export type GanttLinkArrow = {
  direction: 'right' | 'left',
  point: GanttLinkPoint
}