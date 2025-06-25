import { GanttGroupViewClassConstructor } from '@/types/gantt-group';
import { GanttGroup } from './gantt-group';

export class GanttGroupView extends GanttGroup {
  _isExpand = false;
  barOverlap = false;
  rows = 1;

  constructor(data: GanttGroupViewClassConstructor) {
    super(data);
    this._isExpand = data.isExpand || false;
    this.barOverlap = data.barOverlap || false;
  }

  get isExpand() {
    return this._isExpand;
  }

  set isExpand(val) {
    this._isExpand = val;
  }

  get height() {
    return this.layoutConfig.ROW_HEIGHT * this.rows;
  }
}