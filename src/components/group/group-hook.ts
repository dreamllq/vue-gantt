import { onBeforeUnmount, onMounted, Ref, ref } from 'vue';
import { useStore } from '../store';
import { GanttGroupView } from '@/models/gantt-group-view';
import { Events } from '@/types/events';
import { debounce, difference } from 'lodash';

export const useGroupHook = () => {
  const { ganttEntity, bus, lazy } = useStore()!;
  const { visibleAreaStartGroupIndex, visibleAreaEndGroupIndex, lazyReady, calculateVisibleArea } = lazy;

  const lazyGroup: Ref<{
    index: number,
    group: ReturnType<typeof GanttGroupView.prototype.toUiJSON>
  }[]> = ref([]);
  const lazyCalculate = () => {
    lazyGroup.value = [];
    ganttEntity.groups.expandedGroups.filter((group, index) => {
      if (index >= visibleAreaStartGroupIndex.value && index <= visibleAreaEndGroupIndex.value) {
        lazyGroup.value.push({
          index,
          group: group.toUiJSON()
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

  const onGroupChange = debounce(() => {
    calculateVisibleArea();
  }, 0);

  onMounted(() => {
    bus.on(Events.VISIBLE_AREA_CHANGE, onVisibleAreaChange);
    bus.on(Events.GROUPS_CHANGE, onGroupChange);
  });
  
  onBeforeUnmount(() => {
    bus.off(Events.VISIBLE_AREA_CHANGE, onVisibleAreaChange);
    bus.off(Events.GROUPS_CHANGE, onGroupChange);
  });

  return {
    lazyGroup,
    onExpand 
  };
};