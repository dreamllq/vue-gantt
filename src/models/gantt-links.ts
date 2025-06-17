import { GanttLinkClassConstructor } from '@/types/gantt-link';
import { BizArray } from './biz-array';
import { GanttLink } from './gantt-link';
import { GanttLinkView } from './gantt-link-view';

export class GanttLinks extends BizArray<GanttLinkView> {
  add(data:GanttLinkClassConstructor) {
    this.push(new GanttLinkView(data));
  }
}