import { onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue';
import { useStore } from '../store';
import dom from '@/utils/dom';
import { GanttBarView } from '@/models/gantt-bar-view';
import { Events, Id } from '@/types';

export const useSingleSelectHook = () => {
  const { bus, ganttEntity, barHtmlClass } = useStore()!;
  const selectedBar = ref<GanttBarView>();

  onMounted(() => {
    selectedBar.value = ganttEntity.bars.find(item => item.selected);
  });

  const onClick = (e:MouseEvent) => {
    const domPath = dom.getPath(e.target as HTMLElement);
    const barTarget = domPath.find(p => p.classList && p.classList.contains(barHtmlClass)) as HTMLElement;
    if (barTarget) {
      const type = barTarget.dataset.type as string;
      const id = type === 'number' ? Number(barTarget.dataset.id) : barTarget.dataset.id as Id;
      const bar = ganttEntity.bars.getById(id);
          
      if (bar) {
        const barIds:Id[] = [];
        if (selectedBar.value) {
          selectedBar.value.selected = false;
          barIds.push(selectedBar.value.id);
          if (selectedBar.value.id !== bar.id) {
            selectedBar.value = bar;
            selectedBar.value.selected = true;
          } else {
            selectedBar.value = undefined;
          }
        } else {
          selectedBar.value = bar;
          selectedBar.value.selected = true;
        }
        barIds.push(bar.id);
        bus.emit(Events.BAR_CHANGE, barIds);
        bus.emit(Events.BAR_SELECT_CHANGE, barIds);
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