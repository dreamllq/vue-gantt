import { onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue';
import { useStore } from '../store';
import { GanttBarView } from '@/models/gantt-bar-view';
import { Events } from '@/types/events';
import { BarId } from '@/types/gantt-bar';

export const useMultipleSelectHook = () => {
  const { bus, ganttEntity, barHtmlClass } = useStore()!;
  const onClick = (e:MouseEvent, bar:GanttBarView) => {
    if (bar.selectable !== true) return;
    const barIds:BarId[] = [];
    
    if (e.altKey || e.metaKey) {
      if (ganttEntity.bars.selectedBars.some(item => item.id === bar.id)) {
        bar.selected = false;
      } else {
        bar.selected = true;
      }
      barIds.push(bar.id);
    } else {
      if (ganttEntity.bars.selectedBars.isExist(bar.id)) {
        if (ganttEntity.bars.selectedBars.length === 1) {
          bar.selected = false;
          barIds.push(bar.id);
        } else {
          ganttEntity.bars.selectedBars.map(item => item).forEach(item => {
            if (item.id !== bar.id) {
              item.selected = false;
              barIds.push(item.id);
            }
          });
        }
      } else {
        ganttEntity.bars.selectedBars.map(item => item).forEach(item => {
          item.selected = false;
          barIds.push(item.id);
        });
        bar.selected = true;
        barIds.push(bar.id);
      }
    }
  };

  const onClickOutside = () => {
    const barIds: BarId[] = [];
    const selectedBars = ganttEntity.bars.selectedBars;
    
    if (selectedBars.length > 1) {
      const bars = selectedBars.map(item => item);
      bars.forEach(item => {
        barIds.push(item.id);
        item.selected = false;
      });
    }
  };

  onMounted(() => {
    bus.on(Events.BAR_CLICK, onClick);
    bus.on(Events.BAR_CLICK_OUTSIDE, onClickOutside);
  });

  onBeforeUnmount(() => {
    bus.off(Events.BAR_CLICK, onClick);
    bus.off(Events.BAR_CLICK_OUTSIDE, onClickOutside);
  });
};