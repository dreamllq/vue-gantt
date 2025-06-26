import { Gantt } from '@/models/gantt';
import { useBus } from './bus';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { Events } from '@/types';

export const useDrag = (ganttEntity: Gantt, store:{
  bus: ReturnType<typeof useBus>
}) => {
  const mousedown = ref(false);
  const isDragging = ref(false);
  const dragging = ref({
    x: 0,
    y: 0 
  });
  const draggingMouseEvent = ref<MouseEvent>();

  const onMouseDown = (e:MouseEvent) => {
    if (e.button === 0) {
      // 左键
      mousedown.value = true;
      dragging.value.x = e.x;
      dragging.value.y = e.y;
    }
  };
  const onMouseUp = (e:MouseEvent) => {
    if (mousedown.value === false) return;
    if (e.button === 2) {
      // 右键
      store.bus.emit(Events.CONTEXTMENU, e);
    }
    if (isDragging.value === false) {
      store.bus.emit(Events.CLICK, e);
    } else {
      store.bus.emit(Events.DRAGEND, e);
    }

    mousedown.value = false;
    isDragging.value = false;
  };

  const onMouseMove = (e:MouseEvent) => {
    draggingMouseEvent.value = e;
    if (mousedown.value === false) return;
    if (isDragging.value === false) {
      if (Math.abs(e.x - dragging.value.x) >= 5 || Math.abs(e.y - dragging.value.y) >= 5) {
        store.bus.emit(Events.DRAGSTART, e);
        isDragging.value = true;
      }
    } else {
      store.bus.emit(Events.DRAG, e);
    }
  };

  const updateDragging = () => {
    if (mousedown.value === false) return;
    if (!draggingMouseEvent.value) return;
    onMouseMove(draggingMouseEvent.value);
  };

  const onMouseOutside = () => {
    if (mousedown.value === false) return;
    if (!draggingMouseEvent.value) return;
    onMouseUp(draggingMouseEvent.value);
  };

  onMounted(() => {
    store.bus.on(Events.MOUSE_CONTAINER_OUTSIDE, onMouseOutside);
    store.bus.on(Events.AUTO_SCROLL_CHANGE, updateDragging);
  });

  onBeforeUnmount(() => {
    store.bus.off(Events.MOUSE_CONTAINER_OUTSIDE, onMouseOutside);
    store.bus.off(Events.AUTO_SCROLL_CHANGE, updateDragging);
  });

  return {
    onMouseDown,
    onMouseUp,
    onMouseMove
  };
};