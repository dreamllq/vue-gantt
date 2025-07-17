import { GanttGroupClassConstructor, GroupId } from '@/types/gantt-group';
import { GanttBase } from './gantt-base';
import { BizArray } from './biz-array';
import { GanttBar } from './gantt-bar';
import { GanttAttachedBar } from './gantt-attached-bar';
import { GanttMilestone } from './gantt-milestone';
import { GanttWorkTime } from './gantt-work-time';

export class GanttGroup extends GanttBase {
  id: GroupId;
  _parent:GanttGroup | null;
  children: GanttGroup[] = [];
  bars: BizArray<GanttBar> = new BizArray<GanttBar>();
  dayBarMap: Record<string, (BizArray<GanttBar> | undefined)> = {};
  attachedBars: BizArray<GanttAttachedBar> = new BizArray<GanttAttachedBar>();
  milestones: BizArray<GanttMilestone> = new BizArray<GanttMilestone>();
  workTimes: BizArray<GanttWorkTime> = new BizArray<GanttWorkTime>();

  constructor(data:GanttGroupClassConstructor) {
    super(data);
    this.id = data.id;
    this._parent = data.parent || null;
    
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