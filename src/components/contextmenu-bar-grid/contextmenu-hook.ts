import { onBeforeUnmount, onMounted } from 'vue';
import { useStore } from '../store';
import { Events, Id } from '@/types';
import dom from '@/utils/dom';

export const useContextmenuHook = () => {
  const { bus, barHtmlClass, ganttEntity } = useStore()!;

  const onContextmenu = (e:MouseEvent) => {
    console.log(Events.CONTEXTMENU);
    
    const domPath = dom.getPath(e.target as HTMLElement);
    const barTarget = domPath.find(p => p.classList && p.classList.contains(barHtmlClass)) as HTMLElement;
    if (barTarget) {
      const type = barTarget.dataset.type as string;
      const id = type === 'number' ? Number(barTarget.dataset.id) : barTarget.dataset.id as Id;
      const bar = ganttEntity.bars.getById(id);
              
      if (bar) {
        bus.emit(Events.BAR_CONTEXTMENU, { barId: bar.id }, e);
      } 
    }
  };

  onMounted(() => {
    bus.on(Events.CONTEXTMENU, onContextmenu);
  });

  onBeforeUnmount(() => {
    bus.off(Events.CONTEXTMENU, onContextmenu);
  });
};