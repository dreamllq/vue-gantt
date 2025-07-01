import { GanttGroupViewClassConstructor, GroupId } from '@/types/gantt-group';
import { GanttGroup } from './gantt-group';
import { BizArray } from './biz-array';
import { GanttAttachedBarView } from './gantt-attached-bar-view';
import { GanttBarView } from './gantt-bar-view';
import { max } from 'lodash';
import { GanttBus } from './gantt-bus';
import { GanttBusEvents } from '@/types/gantt-bus';

export class GanttGroupView extends GanttGroup {
  _isExpand = false;
  barOverlap = false;
  isShow = true;
  private _height:number;
  bars: BizArray<GanttBarView> = new BizArray<GanttBarView>();
  attachedBars: BizArray<GanttAttachedBarView> = new BizArray<GanttAttachedBarView>();
  barsHeight = 0;
  attachedBarsHeight = 0;
  bus: GanttBus;

  constructor(data: GanttGroupViewClassConstructor) {
    super(data);
    this._isExpand = data.isExpand || false;
    this.barOverlap = data.barOverlap || false;
    this.bus = data.bus;

    this.barsHeight = this.layoutConfig.ROW_HEIGHT;
    this._height = this.barsHeight + this.attachedBarsHeight;

    // this.bars.on(BizArray.Events.CHANGE, (diff:{addItems:[], deleteItems:[]}) => {
    //   if (this.barOverlap === false) {
    //     if (diff.deleteItems.length > 0) {
    //       this.bus.emit(GanttBusEvents.GROUP_OVERLAP_CHANGE, { groupId: this.id });
    //     }
    //   } else {
    //     this.calculateBarsHeight();
    //     this.calculateHeight();
    //   }
    // });

    this.attachedBars.on(BizArray.Events.CHANGE, () => {
      this.calculateAttachedBarsHeight();
      this.calculateHeight();
    });
  }

  get isExpand() {
    return this._isExpand;
  }

  set isExpand(val) {
    this._isExpand = val;
  }

  get height() {
    return this._height;
  }

  calculateBarsHeight() {
    let barRows = 1;
    let height:number;
    if (!this.barOverlap) {
      barRows = max([...this.bars.map(item => item.rowIndex + 1), 1])!;
      height = this.layoutConfig.ROW_HEIGHT * barRows;
    } else {
      height = this.layoutConfig.ROW_HEIGHT * barRows;
    }
    if (height !== this.barsHeight) {
      this.barsHeight = height;
      this.bus.emit(GanttBusEvents.GROUP_BARS_HEIGHT_CHANGE, { groupId: this.id });
    }
  }

  calculateAttachedBarsHeight() {
    let height = 0;
    if (this.config.showAttachedBar) {
      if (this.attachedBars.length > 0) {
        height = this.layoutConfig.ATTACHED_ROW_HEIGHT;
      }
    } 

    if (height !== this.attachedBarsHeight) {
      this.attachedBarsHeight = height;
      this.bus.emit(GanttBusEvents.GROUP_ATTACHED_BARS_HEIGHT_CHANGE, { groupId: this.id });
    }
  }

  calculateHeight() {
    const height = this.barsHeight + this.attachedBarsHeight;

    if (height !== this._height) {
      this._height = height;
      this.bus.emit(GanttBusEvents.GROUP_HEIGHT_CHANGE, { groupId: this.id });
    }
  }

  calculate() {
    if (!this.isShow) return;
    // this.calculateHeight();
  }
}