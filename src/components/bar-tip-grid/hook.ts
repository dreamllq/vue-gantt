import { onBeforeUnmount, onMounted, Ref, ref } from 'vue';
import { useStore } from '../store';
import { Events } from '@/types/events';
import { BarId } from '@/types/gantt-bar';
import { GanttBarView } from '@/models/gantt-bar-view';

export const useBarTipGridHook = () => {
  const { bus, ganttEntity } = useStore()!;
  const barIds:Ref<BarId[]> = ref([]);
  const tipBars: Ref<GanttBarView[]> = ref([]);
  const onBarLazyChange = (_barIds:BarId[]) => {
    barIds.value = _barIds;
    tipBars.value = ganttEntity.bars.selectedBars.filter(item => _barIds.includes(item.id));
  };

  const onBarPosChange = () => {
    tipBars.value = ganttEntity.bars.selectedBars.filter(item => barIds.value.includes(item.id));
  };

  onMounted(() => {
    bus.on(Events.BAR_LAZY_CHANGE, onBarLazyChange);
    bus.on(Events.BAR_CHANGE_FRAGMENTATION, onBarPosChange);
  });

  onBeforeUnmount(() => {
    bus.off(Events.BAR_LAZY_CHANGE, onBarLazyChange);
    bus.off(Events.BAR_CHANGE_FRAGMENTATION, onBarPosChange);
  });

  return { tipBars };
};