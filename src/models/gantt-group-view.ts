import { GanttGroupViewClassConstructor } from '@/types/gantt-group';
import { GanttGroup } from './gantt-group';

export class GanttGroupView extends GanttGroup {
  _isExpand = false;
  constructor(data: GanttGroupViewClassConstructor) {
    super(data);
    this._isExpand = data.isExpand || false;
  }

  get isExpand() {
    return this._isExpand;
  }

  set isExpand(val) {
    this._isExpand = val;
  }
}