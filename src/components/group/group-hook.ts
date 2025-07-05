import { onBeforeUnmount, onMounted, Ref, ref } from 'vue';
import { useStore } from '../store';
import { GanttGroupView } from '@/models/gantt-group-view';
import { Events } from '@/types/events';
import { difference } from 'lodash';

export const useGroupHook = () => {
  const { ganttEntity, bus, lazy } = useStore()!;
  const { visibleAreaStartGroupIndex, visibleAreaEndGroupIndex, lazyReady } = lazy;

  const lazyGroup: Ref<{
    index: number,
    group: GanttGroupView
  }[]> = ref([]);
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

  const onExpand = (group: GanttGroupView) => {
    group.isExpand = !group.isExpand;
  };
  
  const onVisibleAreaChange = () => {
    lazyCalculate();
  };

  onMounted(() => {
    bus.on(Events.VISIBLE_AREA_CHANGE, onVisibleAreaChange);
    bus.on(Events.GROUPS_CHANGE, onVisibleAreaChange);
  });
  
  onBeforeUnmount(() => {
    bus.off(Events.VISIBLE_AREA_CHANGE, onVisibleAreaChange);
    bus.off(Events.GROUPS_CHANGE, onVisibleAreaChange);
  });

  return {
    lazyGroup,
    onExpand 
  };
};