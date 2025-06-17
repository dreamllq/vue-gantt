import { Id } from '@/types/id';
import { GanttGroupWorkTimes } from './gantt-group-work-times';
import { GanttGroupClassConstructor } from '@/types/gantt-group';
import { GanttBase } from './gantt-base';

export class GanttGroup extends GanttBase {
  id: Id;
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