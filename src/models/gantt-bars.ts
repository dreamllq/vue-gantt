import { GanttBarClassConstructor } from '@/types/gantt-bar';
import { BizArray } from './biz-array';
import { GanttBar } from './gantt-bar';
import { GanttBarView } from './gantt-bar-view';

export class GanttBars extends BizArray<GanttBarView> {
  add(data: GanttBarClassConstructor) {
    this.push(new GanttBarView(data));
  }
}