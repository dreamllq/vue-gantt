import { GanttGroupWorkTimes } from './gantt-group-work-times';
import { GanttGroupClassConstructor, GroupId } from '@/types/gantt-group';
import { GanttBase } from './gantt-base';
import { GanttBar } from './gantt-bar';
import { GanttAttachedBar } from './gantt-attached-bar';
import { BizArray } from './biz-array';

export class GanttGroup extends GanttBase {
  id: GroupId;
  _parent:GanttGroup | null;
  children: GanttGroup[] = [];
  workTimes: GanttGroupWorkTimes;

  constructor(data:GanttGroupClassConstructor) {
    super(data);
    this.id = data.id;
    this._parent = data.parent || null;
    this.workTimes = data.workTimes || [];
    
    if (this._parent) {
      this._parent.children.push(this);
    }
  }

  get deep() {
    if (this._parent) {
      return this._parent.deep + 1;
    } else {
      return 0;
    }
  }

  removeChild(child: GanttGroup) {
    this.children = this.children.filter(item => item.id !== child.id);
  }

  set parent(p: GanttGroup | null) {
    if (this._parent !== null) {
      this._parent.removeChild(this);
    }

    this._parent = p || null;

    if (this._parent !== null) {
      this._parent.children.push(this);
    }
  }

  get parent(): GanttGroup | null {
    return this._parent;
  }
}