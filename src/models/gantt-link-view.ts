import { Arrow, GanttLinkType, GanttLinkViewClassConstructor, LinkPath } from '@/types/gantt-link';
import { GanttLink } from './gantt-link';
import { GanttBars } from './gantt-bars';
import { calculateFinishToFinishLink } from '@/utils/link/finish-to-finish-link';
import { calculateFinishToStartLink } from '@/utils/link/finish-to-start-link';
import { calculateStartToFinishLink } from '@/utils/link/start-to-finish-link';
import { calculateStartToStartLink } from '@/utils/link/start-to-start-link';
import { cloneDeep, max, min } from 'lodash';
import { GanttJsonDataLink } from '@/types/gantt';

const calculateFunction = {
  [GanttLinkType.FINISH_TO_FINISH]: calculateFinishToFinishLink,
  [GanttLinkType.FINISH_TO_START]: calculateFinishToStartLink,
  [GanttLinkType.START_TO_FINISH]: calculateStartToFinishLink,
  [GanttLinkType.START_TO_START]: calculateStartToStartLink,
  [GanttLinkType.START_TO_START_AND_FINISH_TO_FINISH]: calculateFinishToStartLink
};

export class GanttLinkView extends GanttLink {
  path: LinkPath = [];
  arrow?: Arrow;
  bars: GanttBars;
  isShow = true;
  sx = 0;
  sy = 0;
  ex = 0;
  ey = 0;
  zIndex = 1;

  constructor(data: GanttLinkViewClassConstructor) {
    super(data);
    this.bars = data.bars;
  }

  get sourceBar() {
    return this.bars.getById(this.source.id);
  }

  get targetBar() {
    return this.bars.getById(this.target.id);
  }

  get sourceY() {
    if (this.sourceBar) {
      return this.sourceBar.sy + Math.floor(this.sourceBar.height / 2) - 0.5;
    } 
  }

  get targetY() {
    if (this.targetBar) {
      return this.targetBar.sy + Math.floor(this.targetBar.height / 2) - 0.5;
    } 
  }

  get sourceStartX() {
    if (this.sourceBar) {
      return this.sourceBar.sx;
    }
  }

  get sourceFinishX() {
    if (this.sourceBar) {
      return this.sourceBar.ex;
    }
  }

  get targetStartX() {
    if (this.targetBar) {
      return this.targetBar.sx;
    }
  }

  get targetFinishX() {
    if (this.targetBar) {
      return this.targetBar.ex;
    }
  }

  calculate() {
    if (!this.isShow) return;
    const data = calculateFunction[this.linkType]({
      layoutConfig: this.layoutConfig,
      sourceFinishX: this.sourceFinishX!,
      sourceStartX: this.sourceStartX!,
      sourceY: this.sourceY!,
      targetFinishX: this.targetFinishX!,
      targetStartX: this.targetStartX!,
      targetY: this.targetY!
    });

    this.arrow = data.arrow;
    this.path = data.path;

    this.sx = min(this.path.map(point => point.x)) || 0;
    this.sy = min(this.path.map(point => point.y)) || 0;
    this.ex = max(this.path.map(point => point.x)) || 0;
    this.ey = max(this.path.map(point => point.y)) || 0;
  }

  toUiJSON() {
    return {
      id: this.id,
      arrow: cloneDeep(this.arrow),
      path: cloneDeep(this.path),
      sourceId: this.source.id,
      targetId: this.target.id,
      sx: this.sx,
      sy: this.sy,
      ex: this.ex,
      ey: this.ey,
      zIndex: this.zIndex,
      selected: this.bars.getById(this.source.id)!.selected || this.bars.getById(this.target.id)!.selected,
      color: this.bars.getById(this.source.id)?.color
    };
  }

  toJSON():GanttJsonDataLink {
    return {
      id: this.id,
      sourceId: this.source.id,
      targetId: this.target.id,
      linkType: this.linkType
    };
  }
}