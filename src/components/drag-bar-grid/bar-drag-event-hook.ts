import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useStore } from '../store';
import { Events } from '@/types/events';
import dom from '@/utils/dom';
import { BarId } from '@/types/gantt-bar';
import { GanttBarView } from '@/models/gantt-bar-view';

export const useBarDragEvent = () => {
  const { bus, ganttEntity, barHtmlClass } = useStore()!;
  const draggingBar = ref<GanttBarView>();
  const onDragStart = (e:MouseEvent) => {
    const domPath = dom.getPath(e.target as HTMLElement);
    const barTarget = domPath.find(p => p.classList && p.classList.contains(barHtmlClass)) as HTMLElement;
    if (barTarget) {
      const type = barTarget.dataset.type as string;
      const id = type === 'number' ? Number(barTarget.dataset.id) : barTarget.dataset.id as BarId;
      const bar = ganttEntity.bars.getById(id);
          
      if (bar) {
        if (bar.draggable !== true) return;
        
        draggingBar.value = bar;
        bus.emit(Events.BAR_DRAGSTART, e, draggingBar.value);
      }
    }
  };

  const onDrag = (e: MouseEvent) => {
    if (!draggingBar.value) return;
    bus.emit(Events.BAR_DRAG, e, draggingBar.value);
  };

  const onDragEnd = (e: MouseEvent) => {
    bus.emit(Events.BAR_DRAGEND, e, draggingBar.value);
    draggingBar.value = undefined;
  };


  onMounted(() => {
    bus.on(Events.DRAGSTART, onDragStart);
    bus.on(Events.DRAG, onDrag);
    bus.on(Events.DRAGEND, onDragEnd);
  });
  
  onBeforeUnmount(() => {
    bus.off(Events.DRAGSTART, onDragStart);
    bus.off(Events.DRAG, onDrag);
    bus.off(Events.DRAGEND, onDragEnd);
  });
};