import { GanttMilestoneView } from '@/models/gantt-milestone-view';
import { onBeforeUnmount, onMounted, ShallowRef, shallowRef } from 'vue';
import { useStore } from '../store';
import { isRectanglesOverlap } from '@/utils/is-rectangles-overlap';
import { Events } from '@/types/events';
import { GroupId } from '@/types/gantt-group';

export const useMilestoneHook = () => {
  const lazyMilestoneGrid:ShallowRef<ReturnType<typeof GanttMilestoneView.prototype.toJSON>[]> = shallowRef([]);

  const { ganttEntity, bus } = useStore()!;

  const showCalculate = () => {
    lazyMilestoneGrid.value = ganttEntity.milestones
      .filter(item => item.isShow)
      .map(item => item.toJSON());
  };

  const onGroupExpandChange = (data: { oldGroupIds: GroupId[]; newGroupIds: GroupId[]; addGroupIds: GroupId[]; deleteGroupIds: GroupId[] }) => {
    ganttEntity.milestones.updateShow();
    ganttEntity.milestones.updateGroupExpandChangeEffectBar([...data.addGroupIds, ...data.deleteGroupIds]);
    bus.emit(Events.MILESTONE_VISIBLE_CHANGE);
  };

  onMounted(() => {
    showCalculate();
    bus.on(Events.GROUP_EXPAND_CHANGE, onGroupExpandChange);
    bus.on(Events.MILESTONE_VISIBLE_CHANGE, showCalculate);
  });
    
  onBeforeUnmount(() => {
    bus.off(Events.GROUP_EXPAND_CHANGE, onGroupExpandChange);
    bus.off(Events.MILESTONE_VISIBLE_CHANGE, showCalculate);
  });

  return { lazyMilestoneGrid };
};