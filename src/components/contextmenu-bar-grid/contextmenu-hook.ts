import { onBeforeUnmount, onMounted } from 'vue';
import { useStore } from '../store';
import dom from '@/utils/dom';
import { Events } from '@/types/events';
import { BarId } from '@/types/gantt-bar';

export const useContextmenuHook = () => {
  const { bus, barHtmlClass, ganttEntity } = useStore()!;

  const onContextmenu = (e:MouseEvent) => {
    const domPath = dom.getPath(e.target as HTMLElement);
    const barTarget = domPath.find(p => p.classList && p.classList.contains(barHtmlClass)) as HTMLElement;
    if (barTarget) {
      const type = barTarget.dataset.type as string;
      const id = type === 'number' ? Number(barTarget.dataset.id) : barTarget.dataset.id as BarId;
      const bar = ganttEntity.bars.getById(id);
              
      if (bar) {
        if (!bar.contextMenuEnable) return;
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