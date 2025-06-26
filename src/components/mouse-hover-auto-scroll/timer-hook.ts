import { Ref, watch } from 'vue';
import { useStore } from '../store';

export const useTimerHook = (toggleScrollFlag: Ref<boolean>, toggleScroll: ()=>void) => {
  const { ganttEntity } = useStore()!;
  watch(toggleScrollFlag, () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    if (toggleScrollFlag.value) {
      timer = setInterval(() => {
        toggleScroll();
      }, ganttEntity.layoutConfig.AUTO_SCROLL_INTERVAL_MS);
    }
  });
  
  let timer: NodeJS.Timer | null = null;
};