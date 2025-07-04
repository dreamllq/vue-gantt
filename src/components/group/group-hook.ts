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
    group._isExpand = !group._isExpand;
    const oldExpandedGroupIds = ganttEntity.groups.expandedGroups.map(group => group.id);
    ganttEntity.groups.calculateExpandedGroups();
    ganttEntity.groups.calculate();
    const newExpandedGroupIds = ganttEntity.groups.expandedGroups.map(group => group.id);
    bus.emit(Events.GROUP_CHANGE, [group.id]);
    bus.emit(Events.GROUP_EXPAND_CHANGE, {
      newGroupIds: newExpandedGroupIds,
      oldGroupIds: oldExpandedGroupIds,
      addGroupIds: difference(newExpandedGroupIds, oldExpandedGroupIds),
      deleteGroupIds: difference(oldExpandedGroupIds, newExpandedGroupIds)
    });
  };
  
  const onVisibleAreaChange = () => {
    lazyCalculate();
  };

  onMounted(() => {
    bus.on(Events.VISIBLE_AREA_CHANGE, onVisibleAreaChange);
    bus.on(Events.GROUP_CHANGE, onVisibleAreaChange);
  });
  
  onBeforeUnmount(() => {
    bus.off(Events.VISIBLE_AREA_CHANGE, onVisibleAreaChange);
    bus.off(Events.GROUP_CHANGE, onVisibleAreaChange);
  });

  return {
    lazyGroup,
    onExpand 
  };
};