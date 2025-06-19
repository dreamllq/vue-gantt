import { Gantt } from '@/models/gantt';
import { useBus } from './bus';
import { ref } from 'vue';
import { Id } from '@/types/id';


export const useDrag = (ganttEntity: Gantt, store:{
  bus: ReturnType<typeof useBus>
}) => {
  const mousedown = ref(false);
  const isDragging = ref(false);
  const onMouseDown = (e:MouseEvent) => {
    mousedown.value = true;
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
      store.bus.emit('dragstart', e);
    } else {
      store.bus.emit('drag', e);
    }
    isDragging.value = true;
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