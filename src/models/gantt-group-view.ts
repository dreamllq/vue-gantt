import { GanttGroupViewClassConstructor, GroupId } from '@/types/gantt-group';
import { GanttGroup } from './gantt-group';
import { BizArray } from './biz-array';
import { GanttAttachedBarView } from './gantt-attached-bar-view';
import { GanttBarView } from './gantt-bar-view';
import { max } from 'lodash';
import { GanttBus } from './gantt-bus';
import { GanttBusEvents } from '@/types/gantt-bus';
import { GanttMilestoneView } from './gantt-milestone-view';
import { GanttWorkTimeView } from './gantt-work-time-view';
import { GanttJsonDataGroup } from '@/types/gantt';

export class GanttGroupView extends GanttGroup {
  private _isExpand = false;
  barOverlap = false;
  isShow = true;
  private _height = 0;
  bars: BizArray<GanttBarView> = new BizArray<GanttBarView>();
  attachedBars: BizArray<GanttAttachedBarView> = new BizArray<GanttAttachedBarView>();
  milestones: BizArray<GanttMilestoneView> = new BizArray<GanttMilestoneView>();
  workTimes: BizArray<GanttWorkTimeView> = new BizArray<GanttWorkTimeView>();
  barsHeight = 0;
  attachedBarsHeight = 0;
  bus: GanttBus;

  constructor(data: GanttGroupViewClassConstructor) {
    super(data);
    this._isExpand = data.isExpand || false;
    this.barOverlap = data.barOverlap || false;
    this.bus = data.bus;

    this.attachedBars.on(BizArray.Events.CHANGE, () => {
      this.calculateAttachedBarsHeight();
      this.calculateHeight();
    });
  }

  get isExpand() {
    return this._isExpand;
  }

  set isExpand(val) {
    if (this._isExpand === val) return;
    const oldValue = this._isExpand;
    this._isExpand = val;
    
    this.bus.emit(GanttBusEvents.GROUP_EXPAND_CHANGE, {
      groupId: this.id,
      newValue: val,
      oldValue
    });
    this.bus.emit(GanttBusEvents.GROUP_CHANGE, [this.id]);
  }

  get height() {
    return this._height;
  }

  calculateBarsHeight(emit = true) {
    let barRows = 1;
    let height = 0;
    if (this.isShow) {
      if (!this.barOverlap) {
        barRows = max([...this.bars.map(item => item.rowIndex + 1), 1])!;
        height = this.layoutConfig.ROW_HEIGHT * barRows;
      } else {
        height = this.layoutConfig.ROW_HEIGHT * barRows;
      }
    }
    if (height !== this.barsHeight) {
      this.barsHeight = height;
      emit && this.bus.emit(GanttBusEvents.GROUP_BARS_HEIGHT_CHANGE, { groupId: this.id });
    }
  }

  calculateAttachedBarsHeight(emit = true) {
    let height = 0;
    if (this.isShow) {
      if (this.config.showAttachedBars) {
        if (this.attachedBars.length > 0) {
          height = this.layoutConfig.ATTACHED_ROW_HEIGHT;
        }
      } 
    }

    if (height !== this.attachedBarsHeight) {
      this.attachedBarsHeight = height;
      emit && this.bus.emit(GanttBusEvents.GROUP_ATTACHED_BARS_HEIGHT_CHANGE, { groupId: this.id });
    }
  }

  calculateHeight(emit = true) {
    const height = this.barsHeight + this.attachedBarsHeight;

    if (height !== this._height) {
      this._height = height;
      emit && this.bus.emit(GanttBusEvents.GROUP_HEIGHT_CHANGE, { groupId: this.id });
    }
  }

  calculate() {
    this.calculateBarsHeight();
    this.calculateAttachedBarsHeight();
    this.calculateHeight();
  }

  initHeight() {
    this.calculateBarsHeight(false);
    this.calculateAttachedBarsHeight(false);
    this.calculateHeight(false);
  }

  toUiJSON() {
    return {
      id: this.id,
      barOverlap: this.barOverlap,
      isExpand: this.isExpand,
      parentId: this.parent?.id,
      height: this.height,
      deep: this.deep,
      hasChildren: this.children.length > 0
    };
  }
  toJSON():GanttJsonDataGroup {
    return {
      id: this.id,
      barOverlap: this.barOverlap,
      isExpand: this.isExpand,
      parentId: this.parent?.id
    };
  }
}