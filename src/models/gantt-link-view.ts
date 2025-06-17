import { GanttLinkArrow, GanttLinkPath, GanttLinkViewClassConstructor } from '@/types/gantt-link';
import { GanttLink } from './gantt-link';

export class GanttLinkView extends GanttLink {
  path: GanttLinkPath = [];
  arrow?: GanttLinkArrow;
  constructor(data: GanttLinkViewClassConstructor) {
    super(data);
  }

  calculate() {
    
  }
}