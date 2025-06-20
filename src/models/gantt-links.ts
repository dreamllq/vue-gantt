import { GanttLinkViewClassConstructor } from '@/types/gantt-link';
import { BizArray } from './biz-array';
import { GanttLinkView } from './gantt-link-view';
import { Id } from '@/types/id';

export class GanttLinks extends BizArray<GanttLinkView> {
  add(data:GanttLinkViewClassConstructor) {
    this.push(new GanttLinkView(data));
  }

  getLinksByBarId(id:Id) {
    return this.filter(link => link.target.id === id || link.source.id === id);
  }

  calculate() {
    this.forEach(item => item.calculate());
  }
}