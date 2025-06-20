import { Gantt } from '@/models/gantt';
import { useBus } from './bus';
import { ref } from 'vue';
import { Id } from '@/types/id';


export const useDrag = (ganttEntity: Gantt, store:{
  bus: ReturnType<typeof useBus>
}) => {
  const mousedown = ref(false);
  const isDragging = ref(false);
  const dragging = ref({
    x: 0,
    y: 0 
  });
  const onMouseDown = (e:MouseEvent) => {
    mousedown.value = true;
    dragging.value.x = e.x;
    dragging.value.y = e.y;
  };
  const onMouseUp = (e:MouseEvent) => {
    if (mousedown.value === false) return;
    if (isDragging.value === false) {
      store.bus.emit('click', e);
    } else {
      store.bus.emit('dragend', e);
    }

    mousedown.value = false;
    isDragging.value = false;
  };

  const onMouseMove = (e:MouseEvent) => {
    if (mousedown.value === false) return;
    if (isDragging.value === false) {
      if (Math.abs(e.x - dragging.value.x) >= 5 || Math.abs(e.y - dragging.value.y) >= 5) {
        store.bus.emit('dragstart', e);
        isDragging.value = true;
      }
    } else {
      store.bus.emit('drag', e);
    }
  };

  const onClick = (e:MouseEvent) => {
  };

  return {
    onMouseDown,
    onMouseUp,
    onMouseMove,
    onClick
  };
};