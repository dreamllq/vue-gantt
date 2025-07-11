import { Gantt } from '@/models/gantt';
import { computed, ref } from 'vue';
import { useBus } from './bus';
import { Events } from '@/types/events';
import { Id } from '@/types/id';
import { dateDiff } from '@/utils/date-diff';
import { strToDate } from '@/utils/to-date';
import { Unit } from '@/types/unit';
import { dateAdd } from '@/utils/date-add';
import { dateTimeFormat } from '@/utils/date-time-format';

export const useScroll = (ganttEntity:Gantt, store:{
    bus: ReturnType<typeof useBus>;
}) => {
  const scrollReady = ref(false);
  const _scrollLeft = ref(0);
  const _scrollTop = ref(0);
  
  const scrollPos: {groupId?:Id, datetime?:string} = {};

  const scrollLeft = computed({
    get() {
      return _scrollLeft.value;
    },
    set(val) {
      if (val < 0) {
        _scrollLeft.value = 0;
      } else if (val > ganttEntity.scroll.xScrollBarWidth - ganttEntity.scroll.xScrollWidth) {
        _scrollLeft.value = ganttEntity.scroll.xScrollBarWidth - ganttEntity.scroll.xScrollWidth;
      } else {
        _scrollLeft.value = val;
      }
    }
  });

  const scrollTop = computed({
    get() {
      return _scrollTop.value;
    },
    set(val) {
      if (val < 0) {
        _scrollTop.value = 0;
      } else if (val > ganttEntity.scroll.yScrollBarHeight - ganttEntity.scroll.yScrollHeight) {
        _scrollTop.value = ganttEntity.scroll.yScrollBarHeight - ganttEntity.scroll.yScrollHeight;
      } else {
        _scrollTop.value = val;
      }
    }
  });
  const calculate = () => {
    ganttEntity.scroll.calculate();
    scrollReady.value = true;
  };


  const onWheel = (evt) => {
    store.bus.emit(Events.WHEEL, evt);

    if (evt.shiftKey === true) {
      scrollLeft.value += evt.deltaY;
    } else {
      scrollTop.value += evt.deltaY;
      scrollLeft.value += evt.deltaX;
    }
  };

  const saveCurrentPos = () => {
    const groupIndex = ganttEntity.groups.getGroupIndexByTop(scrollTop.value);
    const groupId = ganttEntity.groups.expandedGroups[groupIndex].id;

    const seconds = Math.floor(scrollLeft.value / ganttEntity.config.secondWidth);
    
    const datetime = dateTimeFormat(dateAdd(strToDate(ganttEntity.config.start), seconds, Unit.SECOND));

    scrollPos.groupId = groupId;
    scrollPos.datetime = datetime;
    
  };

  const revertPos = () => {
    if (scrollPos.groupId) {
      scrollTop.value = ganttEntity.groups.getGroupTopByIndex(ganttEntity.groups.getGroupIndex(ganttEntity.groups.getById(scrollPos.groupId)!));
    }

    if (scrollPos.datetime) {
      scrollLeft.value = dateDiff(strToDate(scrollPos.datetime), strToDate(ganttEntity.config.start), Unit.SECOND) * ganttEntity.config.secondWidth;
    }
  };

  return {
    scrollReady,
    scrollLeft,
    scrollTop,
    calculate,
    onWheel,
    saveCurrentPos,
    revertPos
  };
};