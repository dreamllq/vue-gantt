import { Id } from '@/types/id';
import { GanttBar } from './gantt-bar';
import { GanttLinkClassConstructor, GanttLinkType } from '@/types/gantt-link';
import { GanttBase } from './gantt-base';

export class GanttLink extends GanttBase {
  id: Id;
  source: GanttBar;
  target: GanttBar;
  linkType: GanttLinkType;

  constructor(data:GanttLinkClassConstructor) {
    super(data);
    this.id = data.id;
    this.source = data.source;
    this.target = data.target;
    this.linkType = data.linkType || GanttLinkType.FINISH_TO_START;
  }
}