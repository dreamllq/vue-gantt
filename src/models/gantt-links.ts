import { GanttLinkViewClassConstructor, LinkId, LinkShowStrategy } from '@/types/gantt-link';
import { BizArray } from './biz-array';
import { GanttLinkView } from './gantt-link-view';
import { v4 as uuidv4 } from 'uuid';
import { GanttBars } from './gantt-bars';
import { BarId } from '@/types/gantt-bar';
import { GanttLinksClassConstructor } from '@/types/gantt-links';
import { GanttBus } from './gantt-bus';
import { GanttBusEvents } from '@/types/gantt-bus';
import { GanttConfig } from './gantt-config';
import { uniqBy } from 'lodash';
import { GanttJsonDataLink } from '@/types/gantt';

export class GanttLinks extends BizArray<GanttLinkView> {
  linkGroupMap: Record<string, GanttLinkView[]> = {};
  bars: GanttBars;
  bus: GanttBus;
  config: GanttConfig;
  sourceBarLinkMap:Record<BarId, BizArray<GanttLinkView>> = {};
  targetBarLinkMap:Record<BarId, BizArray<GanttLinkView>> = {};

  constructor(data:GanttLinksClassConstructor) {
    super();
    this.bars = data.bars;
    this.bus = data.bus;
    this.config = data.config;

    this.bus.on(GanttBusEvents.BAR_REMOVE, (ids: BarId[]) => {
      this.removeLinksBarIds(ids);
    });

    // this.bus.on(GanttBusEvents.BAR_CHANGE, (ids: BarId[]) => {
    //   const links = ids.reduce<GanttLinkView[]>((acc, id) => [...acc, ...this.getLinksByBarId(id)], []);
    //   this.updateShow();
    //   links.forEach(link => link.calculate());
    //   this.bus.emit(GanttBusEvents.LINK_CHANGE, links.map(link => link.id));
    // });
  }

  add(data:GanttLinkViewClassConstructor) {
    const link = new GanttLinkView(data);
    this.push(link);

    if (!Array.isArray(this.sourceBarLinkMap[link.source.id])) {
      this.sourceBarLinkMap[link.source.id] = new BizArray<GanttLinkView>();
    }
    this.sourceBarLinkMap[link.source.id].push(link);
    if (!Array.isArray(this.targetBarLinkMap[link.target.id])) {
      this.targetBarLinkMap[link.target.id] = new BizArray<GanttLinkView>();
    }
    this.targetBarLinkMap[link.target.id].push(link);
  }

  removeById(id: LinkId): void {
    const link = this.getById(id);
    if (!link) return;
    super.removeById(id);
    this.sourceBarLinkMap[link.source.id].removeById(link.id);
    this.targetBarLinkMap[link.target.id].removeById(link.id);
    this.calculateLinkGroupMap();
    this.bus.emit(GanttBusEvents.LINKS_CHANGE);
  }

  getLinksByBarId(id:BarId) {
    const list:GanttLinkView[] = [];
    
    this.sourceBarLinkMap[id]?.forEach(link => list.push(link));
    this.targetBarLinkMap[id]?.forEach(link => list.push(link));
    return uniqBy(list, item => item.id);
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
    if (this.config.linkShowStrategy !== LinkShowStrategy.SELECTED_ALL) return;
    this.linkGroupMap = {};
    this.forEach(item => item.linkGroup = '');

    const startLinks = this.calculateStartLinks();
    startLinks.forEach(link => {
      // #region 此link的下一个link是否已经赋值过linkGroup,有linkGroup则赋值给当前link，否则初始化当前link.linkGroup
      const sameSourceLink = this.sourceBarLinkMap[link.source.id].find(item => item.linkGroup);
      if (sameSourceLink) {
        link.linkGroup = sameSourceLink.linkGroup;
        this.linkGroupMap[link.linkGroup!].push(link);
      } else {
        link.linkGroup = uuidv4();
        this.linkGroupMap[link.linkGroup] = [link];
      }
      // #endregion
      let next = this.sourceBarLinkMap[link.target.id] || [];
      while (next.length > 0) {
        const tempNext:BizArray<GanttLinkView> = new BizArray<GanttLinkView>();
        next.forEach(nextItem => {
          const sameTargetLink = this.targetBarLinkMap[nextItem.target.id].find(item => item.linkGroup);
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
            const ls = this.sourceBarLinkMap[nextItem.target.id] || [];
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
      if (!(this.targetBarLinkMap[item.source.id] && this.targetBarLinkMap[item.source.id].length > 0)) {
        startLinks.push(item);
      }
    });
    return startLinks;
  };

  removeLinksBarIds = (ids: BarId[]) => {
    ids.forEach(id => {
      const links = this.getLinksByBarId(id);
      links.forEach(link => {
        this.removeById(link.id);
      });
    });
  };

  toJSON(): GanttJsonDataLink[] {
    return this.map(item => item.toJSON());
  }
}