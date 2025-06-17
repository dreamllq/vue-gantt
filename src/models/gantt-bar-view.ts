import { GanttBarViewClassConstructor } from '@/types/gantt-bar';
import { GanttBar } from './gantt-bar';

export class GanttBarView extends GanttBar {
  sx = 0;
  ex = 0;
  width = 0;
  sy = 0;
  ey = 0;
  height = 0;
  constructor(data:GanttBarViewClassConstructor) {
    super(data);
  }

  calculate() {
    
  }
}