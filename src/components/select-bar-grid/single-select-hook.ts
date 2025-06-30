import { onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue';
import { useStore } from '../store';
import dom from '@/utils/dom';
import { GanttBarView } from '@/models/gantt-bar-view';
import { BarId } from '@/types/gantt-bar';
import { Events } from '@/types/events';

export const useSingleSelectHook = () => {
  const { bus, ganttEntity, barHtmlClass } = useStore()!;
  const selectedBar = ref<GanttBarView>();

  onMounted(() => {
    selectedBar.value = ganttEntity.bars.find(item => item.selected);
  });

  const onClick = (e:MouseEvent, bar: GanttBarView) => {
    if (bar.selectable !== true) return;
    const barIds:BarId[] = [];
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
  };

  onMounted(() => {
    bus.on(Events.BAR_CLICK, onClick);
  });

  onBeforeUnmount(() => {
    bus.off(Events.BAR_CLICK, onClick);
  });
};