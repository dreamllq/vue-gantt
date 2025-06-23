import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useStore } from '../store';
import { GanttGroupView } from '@/models/gantt-group-view';
import { Events } from '@/types';

export const useGroupHook = () => {
  const { ganttEntity, bus, lazy } = useStore()!;
  const { visibleAreaStartGroupIndex, visibleAreaEndGroupIndex, lazyReady } = lazy;

  const lazyGroup = ref<{
    index: number,
    group: GanttGroupView
  }[]>([]);
  const lazyCalculate = () => {
    lazyGroup.value = [];
    
    ganttEntity.groups.expandedGroups.forEach((group, index) => {
      if (index >= visibleAreaStartGroupIndex.value && index <= visibleAreaEndGroupIndex.value) {
        lazyGroup.value.push({
          index,
          group 
        });
      }
    });
  };
  if (lazyReady.value) {
    lazyCalculate();
  }
  
  const onVisibleAreaChange = () => {
    lazyCalculate();
  };
  
  onMounted(() => {
    bus.on(Events.VISIBLE_AREA_CHANGE, onVisibleAreaChange);
  });
  
  onBeforeUnmount(() => {
    bus.off(Events.VISIBLE_AREA_CHANGE, onVisibleAreaChange);
  });

  return { lazyGroup };
};