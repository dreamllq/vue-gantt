import { useMouseInElement } from '@vueuse/core';
import { computed, ref, Ref, watch, watchEffect } from 'vue';
import { useStore } from '../store';
import { useTimerHook } from './timer-hook';
import { Events } from '@/types/events';
import { useAutoScrollHook } from './auto-scroll-hook';

export const useTopHook = (htmlRef: Ref<HTMLElement | undefined>) => {
  const { isOutside, elementX, elementY } = useMouseInElement(htmlRef);
  const { dragging } = useAutoScrollHook();
  const { ganttEntity, scroll, bus } = useStore()!;
  const { scrollLeft, scrollTop } = scroll;
  const isShow = computed(() => dragging.value && ganttEntity.scroll.hasY && scrollTop.value > 0);
  const toggleScrollFlag = computed(() => isShow.value && !isOutside.value);

  useTimerHook(toggleScrollFlag, () => {
    if (scrollTop.value > ganttEntity.layoutConfig.AUTO_SCROLL_SHIFT_AMOUNT_Y) {
      scrollTop.value -= ganttEntity.layoutConfig.AUTO_SCROLL_SHIFT_AMOUNT_Y;
    } else {
      scrollTop.value = 0;
    }

    bus.emit(Events.AUTO_SCROLL_CHANGE);
  });

  return { isShow };
};
