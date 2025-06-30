import { onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue';
import { useStore } from '../store';
import dom from '@/utils/dom';
import { GanttBarView } from '@/models/gantt-bar-view';
import { Events } from '@/types/events';
import { BarId } from '@/types/gantt-bar';

export const useMultipleSelectHook = () => {
  const { bus, ganttEntity, barHtmlClass } = useStore()!;
  const selectedBars = ref<GanttBarView[]>([]);

  onMounted(() => {
    selectedBars.value = ganttEntity.bars.filter(item => item.selected);
  });
  const onClick = (e:MouseEvent, bar:GanttBarView) => {
    if (bar.selectable !== true) return;
    const barIds:BarId[] = [];
    if (e.altKey || e.metaKey) {
      if (selectedBars.value.some(item => item.id === bar.id)) {
        bar.selected = false;
        selectedBars.value = selectedBars.value.filter(item => item.id !== bar.id);
      } else {
        bar.selected = true;
        selectedBars.value.push(bar);
      }
      barIds.push(bar.id);
    } else {
      if (selectedBars.value.some(item => item.id === bar.id)) {
        if (selectedBars.value.length === 1) {
          bar.selected = false;
          barIds.push(bar.id);
          selectedBars.value = [];
        } else {
          selectedBars.value.forEach(item => {
            if (item.id !== bar.id) {
              item.selected = false;
              barIds.push(item.id);
            }
          });
          selectedBars.value = [bar];
        }
      } else {
        selectedBars.value.forEach(item => {
          item.selected = false;
          barIds.push(item.id);
        });
        bar.selected = true;
        barIds.push(bar.id);
        selectedBars.value = [bar];
      }
    }
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