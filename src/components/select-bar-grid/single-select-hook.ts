import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useStore } from '../store';
import { GanttBarView } from '@/models/gantt-bar-view';
import { BarId } from '@/types/gantt-bar';
import { Events } from '@/types/events';

export const useSingleSelectHook = () => {
  const { bus, ganttEntity, barHtmlClass } = useStore()!;
  const onClick = (e:MouseEvent, bar: GanttBarView) => {
    if (bar.selectable !== true) return;
    const barIds:BarId[] = [];
    if (ganttEntity.bars.selectedBars.length > 0) {
      const oldBarId = ganttEntity.bars.selectedBars[0].id;
      barIds.push(oldBarId);
      ganttEntity.bars.selectedBars[0].selected = false;
      if (oldBarId !== bar.id) {
        bar.selected = true;
      }
    } else {
      bar.selected = true;
    }
    barIds.push(bar.id);
    // bus.emit(Events.BAR_CHANGE, barIds);
  };

  onMounted(() => {
    bus.on(Events.BAR_CLICK, onClick);
  });

  onBeforeUnmount(() => {
    bus.off(Events.BAR_CLICK, onClick);
  });
};