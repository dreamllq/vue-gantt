import { Arrow, GanttLinkType, GanttLinkViewClassConstructor, LinkPath } from '@/types/gantt-link';
import { GanttLink } from './gantt-link';
import { GanttBars } from './gantt-bars';
import { calculateFinishToFinishLink } from '@/utils/link/finish-to-finish-link';
import { calculateFinishToStartLink } from '@/utils/link/finish-to-start-link';
import { calculateStartToFinishLink } from '@/utils/link/start-to-finish-link';
import { calculateStartToStartLink } from '@/utils/link/start-to-start-link';
import { cloneDeep } from 'lodash';

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
  }

  toJSON() {
    return {
      id: this.id,
      arrow: cloneDeep(this.arrow),
      path: cloneDeep(this.path),
      sourceId: this.source.id,
      targetId: this.target.id
    };
  }
}