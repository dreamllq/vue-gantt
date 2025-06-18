import { Gantt } from '@/models/gantt';
import { ref } from 'vue';
import { useBus } from './bus';

export const useScroll = (ganttEntity:Gantt, store:{
    bus: ReturnType<typeof useBus>;
}) => {
  const scrollReady = ref(false);
  const scrollLeft = ref(0);
  const scrollTop = ref(0);
  const calculate = () => {
    ganttEntity.scroll.calculate();
    scrollReady.value = true;
  };


  const onWheel = (evt) => {
    store.bus.emit('wheel', evt);

    if (evt.shiftKey === true) {
      if (evt.deltaY > 0) {
        if (scrollLeft.value + evt.deltaY > ganttEntity.scroll.xScrollBarWidth - ganttEntity.scroll.xScrollWidth) {
          scrollLeft.value = ganttEntity.scroll.xScrollBarWidth - ganttEntity.scroll.xScrollWidth;
        } else {
          scrollLeft.value += evt.deltaY;
        }
      } else if (evt.deltaY < 0) {
        if (scrollLeft.value + evt.deltaY < 0) {
          scrollLeft.value = 0;
        } else {
          scrollLeft.value += evt.deltaY;
        }
      }
    } else {
      if (evt.deltaY > 0) {
        if (scrollTop.value + evt.deltaY > ganttEntity.scroll.yScrollBarHeight - ganttEntity.scroll.yScrollHeight) {
          scrollTop.value = ganttEntity.scroll.yScrollBarHeight - ganttEntity.scroll.yScrollHeight;
        } else {
          scrollTop.value += evt.deltaY;
        }
      } else if (evt.deltaY < 0) {
        if (scrollTop.value + evt.deltaY < 0) {
          scrollTop.value = 0;
        } else {
          scrollTop.value += evt.deltaY;
          
        }
      }

      if (evt.deltaX > 0) {
        if (scrollLeft.value + evt.deltaX > ganttEntity.scroll.xScrollBarWidth - ganttEntity.scroll.xScrollWidth) {
          scrollLeft.value = ganttEntity.scroll.xScrollBarWidth - ganttEntity.scroll.xScrollWidth;
        } else {
          scrollLeft.value += evt.deltaX;
        }
      } else if (evt.deltaX < 0) {
        if (scrollLeft.value + evt.deltaX < 0) {
          scrollLeft.value = 0;
        } else {
          scrollLeft.value += evt.deltaX;
        }
      }
    }
  };

  return {
    scrollReady,
    scrollLeft,
    scrollTop,
    calculate,
    onWheel
  };
};