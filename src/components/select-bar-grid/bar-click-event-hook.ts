import { onBeforeUnmount, onMounted } from 'vue';
import { useStore } from '../store';
import { Events } from '@/types/events';
import { BarId } from '@/types/gantt-bar';
import dom from '@/utils/dom';

export const useBarClickEventHook = () => {
  const { bus, ganttEntity, barHtmlClass } = useStore()!;

  const onClick = (e:MouseEvent) => {
    const domPath = dom.getPath(e.target as HTMLElement);
    const barTarget = domPath.find(p => p.classList && p.classList.contains(barHtmlClass)) as HTMLElement;
    if (barTarget) {
      const type = barTarget.dataset.type as string;
      const id = type === 'number' ? Number(barTarget.dataset.id) : barTarget.dataset.id as BarId;
      const bar = ganttEntity.bars.getById(id);
              
      if (bar) {
        if (bar.selectable !== true) return; 
        bus.emit(Events.BAR_CLICK, e, bar);
      } 
    }
  };
  onMounted(() => {
    bus.on(Events.CLICK, onClick);
  });
  
  onBeforeUnmount(() => {
    bus.off(Events.CLICK, onClick);
  });
};