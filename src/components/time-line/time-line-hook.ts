import { onBeforeUnmount, onMounted } from 'vue';
import { useStore } from '../store';

export const useTimeLineHook = () => {
  const { timeLine, bus } = useStore()!;
  timeLine.calculate();
  timeLine.lazyCalculate();

  const onVisibleAreaChange = () => {
    timeLine.lazyCalculate();
  };

  onMounted(() => {
    bus.on('visible-area-change', onVisibleAreaChange);
  });

  onBeforeUnmount(() => {
    bus.off('visible-area-change', onVisibleAreaChange);
  });
};