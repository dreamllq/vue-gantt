import { useMouseInElement } from '@vueuse/core';
import { computed, ref, Ref } from 'vue';
import { useStore } from '../store';
import { useTimerHook } from './timer-hook';
import { Events } from '@/types/events';
import { useAutoScrollHook } from './auto-scroll-hook';

export const useRightHook = (htmlRef: Ref<HTMLElement | undefined>) => {
  const { isOutside, elementX, elementY } = useMouseInElement(htmlRef);
  const { dragging } = useAutoScrollHook();
  const { scroll, ganttEntity, bus } = useStore()!;
  const { scrollLeft, scrollTop } = scroll;

  const isShow = computed(() => dragging.value && ganttEntity.scroll.hasX && scrollTop.value < ganttEntity.scroll.xScrollBarWidth - ganttEntity.scroll.xScrollWidth);
  const toggleScrollFlag = computed(() => isShow.value && !isOutside.value);
  
  useTimerHook(toggleScrollFlag, () => {
    if (scrollLeft.value < ganttEntity.scroll.xScrollBarWidth - ganttEntity.scroll.xScrollWidth - ganttEntity.layoutConfig.AUTO_SCROLL_SHIFT_AMOUNT_X) {
      scrollLeft.value += ganttEntity.layoutConfig.AUTO_SCROLL_SHIFT_AMOUNT_X;
    } else {
      scrollLeft.value = ganttEntity.scroll.xScrollBarWidth - ganttEntity.scroll.xScrollWidth;
    }
    bus.emit(Events.AUTO_SCROLL_CHANGE);
  });

  return { isShow };
};
