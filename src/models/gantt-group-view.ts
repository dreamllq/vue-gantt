import { GanttGroupViewClassConstructor, GroupId } from '@/types/gantt-group';
import { GanttGroup } from './gantt-group';
import { BizArray } from './biz-array';
import { GanttAttachedBarView } from './gantt-attached-bar-view';
import { GanttBarView } from './gantt-bar-view';
import { max } from 'lodash';

export class GanttGroupView extends GanttGroup {
  _isExpand = false;
  barOverlap = false;
  // private _rows = 1;
  isShow = true;
  private _height:number;
  bars: BizArray<GanttBarView> = new BizArray<GanttBarView>();
  attachedBars: BizArray<GanttAttachedBarView> = new BizArray<GanttAttachedBarView>();
  barsHeight = 0;
  attachedBarsHeight = 0;

  constructor(data: GanttGroupViewClassConstructor) {
    super(data);
    this._isExpand = data.isExpand || false;
    this.barOverlap = data.barOverlap || false;

    this._height = this.layoutConfig.ROW_HEIGHT;

    this.bars.on(BizArray.Events.CHANGE, () => {
      this.calculateHeight();
    });

    this.attachedBars.on(BizArray.Events.CHANGE, () => {
      this.calculateHeight();
    });
  }

  get isExpand() {
    return this._isExpand;
  }

  set isExpand(val) {
    this._isExpand = val;
  }

  // get rows() {
  //   return this._rows;
  // }

  // set rows(val) {
  //   this._rows = val;
  //   // this.calculateHeight();
  // }

  get height() {
    return this._height;
  }

  calculateHeight() {
    let height = 0;
    const barRows = max([...this.bars.map(item => item.rowIndex + 1), 1])!;
    const barsHeight = this.layoutConfig.ROW_HEIGHT * barRows;
    
    height += barsHeight;
    this.barsHeight = barsHeight;

    if (this.config.showAttachedBar) {
      if (this.attachedBars.length > 0) {
        height += this.layoutConfig.ATTACHED_ROW_HEIGHT;
        this.attachedBarsHeight = this.layoutConfig.ATTACHED_ROW_HEIGHT;
      }
    } else {
      this.attachedBarsHeight = 0;
    }

    this._height = height;
  }

  calculate() {
    if (!this.isShow) return;
    this.calculateHeight();
  }
}