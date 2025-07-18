import { useStore } from './store';
import { GanttLinkAddParams, LinkId } from '@/types/gantt-link';
import { Unit } from '@/types/unit';
import { BarId, GanttBarAddParams, GanttBarUpdateParams } from '@/types/gantt-bar';
import { GanttBusEvents } from '@/types/gantt-bus';
import { GroupId } from '@/types/gantt-group';
import { DateTimeString } from '@/types/date';
import { strToDate } from '@/utils/to-date';
import { dateDiff } from '@/utils/date-diff';
export const useWrapperHook = () => {

  const { scroll, ganttEntity, bus } = useStore()!;
  const setDraggable = (val: boolean) => {
    ganttEntity.config.draggable = val;
  };

  const setSelectable = (val:boolean) => {
    ganttEntity.config.selectable = val;
  };

  const setShowAttachedBars = (val: boolean) => {
    scroll.saveCurrentPos();
    ganttEntity.config.showAttachedBars = val;
  };

  const setDataScaleUnit = (unit: (keyof typeof Unit)) => {
    scroll.saveCurrentPos();
    ganttEntity.config.dataScaleUnit = Unit[unit];
  };

  const setSizeRatioPercent = (sizeRatioPercent:number) => {
    scroll.saveCurrentPos();
    ganttEntity.layoutConfig.sizeRatioPercent = sizeRatioPercent;
  };

  const removeBarById = (id:BarId) => {
    ganttEntity.bars.removeById(id);
  };

  const addBar = (bar:GanttBarAddParams) => {
    ganttEntity.addBar(bar);
    const b = ganttEntity.bars.getById(bar.id)!;
    b.calculate();
    ganttEntity.bars.calculateGroupOverlap({ groupId: b.group.id });
    ganttEntity.bus.emit(GanttBusEvents.BARS_CHANGE);
  };

  const updateBar = (id:BarId, data:GanttBarUpdateParams) => {
    const bar = ganttEntity.bars.getById(id);
    if (bar) {
      bar.update(data);
    }
  };

  const removeLinkById = (id:LinkId) => {
    ganttEntity.links.removeById(id);
  };

  const addLink = (data: GanttLinkAddParams) => {
    ganttEntity.addLink(data);
    ganttEntity.links.updateShow();
    const link = ganttEntity.links.getById(data.id)!;
    link.calculate();
    ganttEntity.links.calculateLinkGroupMap();
    ganttEntity.bus.emit(GanttBusEvents.LINKS_CHANGE);
  };

  const setBarSelected = (id: BarId, val: boolean) => {
    if (ganttEntity.bars.isExist(id)) {
      const bar = ganttEntity.bars.getById(id)!;
      bar.selected = val;
    }
  };

  const setBarSelectable = (id: BarId, val: boolean) => {
    if (ganttEntity.bars.isExist(id)) {
      const bar = ganttEntity.bars.getById(id)!;
      bar.selected = false;
      bar.selectable = val;
      ganttEntity.bus.emit(GanttBusEvents.BAR_CHANGE, [id]);
    }
  };

  const setBarContextMenuEnable = (id: BarId, val: boolean) => {
    if (ganttEntity.bars.isExist(id)) {
      const bar = ganttEntity.bars.getById(id)!;
      bar.contextMenuEnable = val;
    }
  };

  const setBarDraggable = (id: BarId, val: boolean) => {
    if (ganttEntity.bars.isExist(id)) {
      const bar = ganttEntity.bars.getById(id)!;
      bar.draggable = val;
    }
  };

  const scrollToGroup = (id: GroupId) => {
    const index = ganttEntity.groups.getGroupIndex(ganttEntity.groups.getById(id)!);
    const top = ganttEntity.groups.getGroupTopByIndex(index);
    scroll.scrollTop.value = top;
  };

  const scrollToDatetime = (datetime: DateTimeString) => {
    const date = strToDate(datetime);
    if ((date.getTime() < ganttEntity.config.endTimeMills) && (date.getTime() > ganttEntity.config.startTimeMills)) {
      const seconds = dateDiff(date, strToDate(ganttEntity.config.start), Unit.SECOND);
      const left = seconds * ganttEntity.config.secondWidth;
      scroll.scrollLeft.value = left;
    }
  };

  const getSelectedBarIds = () => ganttEntity.bars.selectedBars.getIds();

  const getBarById = (id:BarId) => {
    if (ganttEntity.bars.isExist(id)) {
      const bar = ganttEntity.bars.getById(id)!;
      return bar.toJSON();
    } else {
      return undefined;
    }
  };

  const getJSON = () => ganttEntity.toJSON();

  return {
    api: () => ({
      setDraggable,
      setSelectable,
      setShowAttachedBars,
      setDataScaleUnit,
      setSizeRatioPercent,
      removeBarById,
      addBar,
      updateBar,
      removeLinkById,
      addLink,
      setBarSelected,
      setBarSelectable,
      setBarContextMenuEnable,
      setBarDraggable,
      scrollToGroup,
      scrollToDatetime,
      getSelectedBarIds,
      getBarById,
      getJSON,
      history: {
        next: () => ganttEntity.history.next(),
        back: () => ganttEntity.history.back()
      }
    }) 
  };
};