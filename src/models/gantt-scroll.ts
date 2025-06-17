import { GanttScrollClassConstructor } from '@/types/gantt-scroll';
import { GanttBase } from './gantt-base';
import { GanttGroups } from './gantt-groups';
import { GanttContainer } from './gantt-container';

export class GanttScroll extends GanttBase {
  hasX = false;
  hasY = false;
  groups: GanttGroups;
  container: GanttContainer;

  constructor(data:GanttScrollClassConstructor) {
    super(data);
    this.groups = data.groups;
    this.container = data.container;
  }

  calculate() {
    const hasScroll = this.calculateHasScroll();
    this.hasX = hasScroll.x;
    this.hasY = hasScroll.y;
  }
  calculateHasScroll() {
    const dataHeight = this.groups.length * this.layoutConfig.ROW_HEIGHT;
    const scheduleWidth = this.config.totalSeconds * this.config.secondWidth;
      
    // 在都没有滚动条的时候，判断数据显示是否超出可视区
    const isOverHeight = dataHeight > (this.container.height - this.layoutConfig.HEADER_HEIGHT);
    const isOverWidth = scheduleWidth > (this.container.width - this.layoutConfig.GRID_CELL_WIDTH);
    if (isOverHeight === true && isOverWidth === false) {
      return {
        x: (scheduleWidth + this.layoutConfig.SCROLL_HEIGHT) > (this.container.width - this.layoutConfig.GRID_CELL_WIDTH),
        y: isOverHeight
      };
    } else if (isOverHeight === false && isOverWidth === true) {
      return {
        x: isOverWidth,
        y: (dataHeight + this.layoutConfig.SCROLL_WIDTH) > (this.container.height - this.layoutConfig.HEADER_HEIGHT)
      };
    } else {
      return {
        x: isOverWidth,
        y: isOverHeight
      };
    }
  }

  get xScrollWidth() {
    return this.container.width - (this.hasY === true ? this.layoutConfig.SCROLL_WIDTH : 0);
  }

  get xScrollBarWidth() {
    return this.config.totalSeconds * this.config.secondWidth + this.layoutConfig.GRID_CELL_WIDTH;
  }

  get yScrollHeight() {
    return this.container.height - this.layoutConfig.HEADER_HEIGHT - (this.hasX === true ? this.layoutConfig.SCROLL_HEIGHT : 0);
  }

  get yScrollBarHeight() {
    return this.groups.length * this.layoutConfig.ROW_HEIGHT;
  }
}