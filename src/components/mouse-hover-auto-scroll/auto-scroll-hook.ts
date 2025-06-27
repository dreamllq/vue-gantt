import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useStore } from '../store';
import { Events } from '@/types/events';
import { BarId } from '@/types/gantt-bar';

export const useAutoScrollHook = () => {
  const { bus } = useStore()!;
  const dragging = ref(false);
  const onDraggingChange = (ids:BarId[], _dragging:boolean) => {
    dragging.value = _dragging;
  };

  onMounted(() => {
    bus.on(Events.BAR_DRAGGING_CHANGE, onDraggingChange);
  });

  onBeforeUnmount(() => {
    bus.off(Events.BAR_DRAGGING_CHANGE, onDraggingChange);
  });

  return { dragging: dragging };
};