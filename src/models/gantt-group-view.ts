import { GanttGroupViewClassConstructor, GroupId } from '@/types/gantt-group';
import { GanttGroup } from './gantt-group';

export class GanttGroupView extends GanttGroup {
  _isExpand = false;
  barOverlap = false;
  private _rows = 1;
  isShow = true;
  private _height:number;

  constructor(data: GanttGroupViewClassConstructor) {
    super(data);
    this._isExpand = data.isExpand || false;
    this.barOverlap = data.barOverlap || false;

    this._height = this.layoutConfig.ROW_HEIGHT * this._rows;
  }

  get isExpand() {
    return this._isExpand;
  }

  set isExpand(val) {
    this._isExpand = val;
  }

  get rows() {
    return this._rows;
  }

  set rows(val) {
    this._rows = val;
    this._height = this.layoutConfig.ROW_HEIGHT * this._rows;
  }

  get height() {
    return this._height;
  }

  calculateHeight() {
    
  }

  calculate() {
    if (!this.isShow) return;

  }
}