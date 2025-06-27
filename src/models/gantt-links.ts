import { GanttLinkViewClassConstructor } from '@/types/gantt-link';
import { BizArray } from './biz-array';
import { GanttLinkView } from './gantt-link-view';
import { v4 as uuidv4 } from 'uuid';
import { GanttBars } from './gantt-bars';
import { BarId } from '@/types/gantt-bar';
import { GanttLinksClassConstructor } from '@/types/gantt-links';
import { GanttBus } from './gantt-bus';

export class GanttLinks extends BizArray<GanttLinkView> {

  linkGroupMap: Record<string, GanttLinkView[]> = {};
  bars: GanttBars;
  bus: GanttBus;

  constructor(data:GanttLinksClassConstructor) {
    super();
    this.bars = data.bars;
    this.bus = data.bus;
  }
  add(data:GanttLinkViewClassConstructor) {
    this.push(new GanttLinkView(data));
  }

  getLinksByBarId(id:BarId) {
    return this.filter(link => link.target.id === id || link.source.id === id);
  }

  updateShow() {
    this.forEach(item => {
      item.isShow = item.sourceBar!.isShow && item.targetBar!.isShow;
    });
  }
  
  calculate() {
    this.forEach(item => item.calculate());
  }

  calculateLinkGroupMap() {
    this.forEach(item => item.linkGroup = '');

    const startLinks = this.calculateStartLinks();
    startLinks.forEach(link => {
      const sameSourceLink = this.find(item => item.linkGroup && item.source.id === link.source.id);
      const sameTargetLink = this.find(item => item.linkGroup && item.target.id === link.target.id);
      if (sameSourceLink) {
        link.linkGroup = sameSourceLink.linkGroup;
        this.linkGroupMap[link.linkGroup!].push(link);
      } else if (sameTargetLink) {
        link.linkGroup = sameTargetLink.linkGroup;
        this.linkGroupMap[link.linkGroup!].push(link);
      } else {
        link.linkGroup = uuidv4();
        this.linkGroupMap[link.linkGroup] = [link];
      }
      let next = this.filter(item => link.target.id === item.source.id);
      while (next.length > 0) {
        const tempNext:GanttLinkView[] = [];
        next.forEach(nextItem => {
          const sameTargetLink = this.find(item => item.linkGroup && item.target.id === nextItem.target.id);
          if (sameTargetLink) {
            if (!nextItem.linkGroup) {
              nextItem.linkGroup = sameTargetLink.linkGroup!;
              this.linkGroupMap[sameTargetLink.linkGroup!].push(nextItem);
              if (link.linkGroup! !== sameTargetLink.linkGroup!) {
                const tempLinkGroup = link.linkGroup!;
                this.linkGroupMap[tempLinkGroup].forEach(item => {
                  item.linkGroup = sameTargetLink.linkGroup!;
                  this.linkGroupMap[sameTargetLink.linkGroup!].push(item);
                });
                delete this.linkGroupMap[tempLinkGroup];
              }
            } else {
              const tempLinkGroup = nextItem.linkGroup!;
              this.linkGroupMap[tempLinkGroup].forEach(item => {
                item.linkGroup = sameTargetLink.linkGroup!;
                this.linkGroupMap[sameTargetLink.linkGroup!].push(item);
              });
              delete this.linkGroupMap[tempLinkGroup];
            }
          } else if (!nextItem.linkGroup) {
            nextItem.linkGroup = link.linkGroup;
            this.linkGroupMap[link.linkGroup!].push(nextItem);
            const ls = this.filter(item => nextItem.target.id === item.source.id);
            ls.forEach(item => tempNext.push(item));
          } else {
            const tempLinkGroup = link.linkGroup!;
            this.linkGroupMap[tempLinkGroup].forEach(item => {
              item.linkGroup = nextItem.linkGroup;
              this.linkGroupMap[nextItem.linkGroup!].push(item);
            });
            delete this.linkGroupMap[tempLinkGroup];
          }
        });
        next = tempNext;
      }
    });
  }

  // 寻找开始链接
  calculateStartLinks = () => {
    const startLinks: GanttLinkView[] = [];

    this.forEach(item => {
      if (!this.some(m => item.source.id === m.target.id)) {
        startLinks.push(item);
      }
    });
    return startLinks;
  };
}