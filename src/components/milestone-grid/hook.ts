import { GanttMilestoneView } from '@/models/gantt-milestone-view';
import { onBeforeUnmount, onMounted, ShallowRef, shallowRef } from 'vue';
import { useStore } from '../store';
import { isRectanglesOverlap } from '@/utils/is-rectangles-overlap';
import { Events } from '@/types/events';

export const useMilestoneHook = () => {
  const lazyMilestoneGrid:ShallowRef<ReturnType<typeof GanttMilestoneView.prototype.toJSON>[]> = shallowRef([]);

  const { ganttEntity, bus } = useStore()!;

  const showCalculate = () => {
    lazyMilestoneGrid.value = ganttEntity.milestones
      .filter(item => item.isShow)
      .map(item => item.toJSON());
  };

  onMounted(() => {
    showCalculate();
    // bus.on(Events.VISIBLE_AREA_CHANGE, onVisibleAreaChange);
  });
    
  onBeforeUnmount(() => {
    // bus.off(Events.VISIBLE_AREA_CHANGE, onVisibleAreaChange);
  });

  return { lazyMilestoneGrid };
};