import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useStore } from '../store';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import { isRectanglesOverlap } from '@/utils/is-rectangles-overlap';
import { Events } from '@/types/events';
import { GroupId } from '@/types/gantt-group';
import { WorkTimeId } from '@/types/gantt-work-time';

type GridItem = {
  id: WorkTimeId,
  seconds: number;
  x: number,
  y: number,
  width: number,
  height: number,
  timeString: string,
  groupId:GroupId
}
export const useWorkTimeGridHook = () => {
  const workTimeGrid = ref<GridItem[]>([]);
  const lazyWorkTimeGrid = ref<GridItem[]>([]);
  let groupMap:Record<GroupId, GridItem[]> = {};


  const { ganttEntity, lazy, bus } = useStore()!;
  const { visibleAreaStartX, visibleAreaEndX, visibleAreaStartY, visibleAreaEndY, lazyReady } = lazy;

  const initData = () => {
    workTimeGrid.value = [];
    groupMap = {};
    ganttEntity.groups.expandedGroups.forEach((group) => {
      group.workTimes.forEach(wt => {
        const item = {
          id: wt.id,
          seconds: wt.seconds,
          x: wt.sx,
          y: ganttEntity.groups.getGroupTopByIndex(ganttEntity.groups.getGroupIndex(group)),
          width: wt.width,
          height: group.height,
          timeString: wt.startTimeString,
          groupId: group.id
        };
        workTimeGrid.value.push(item);
        if (!Array.isArray(groupMap[group.id])) {
          groupMap[group.id] = [];
        }
        groupMap[group.id].push(item);
      });
    });
  };

  const updateData = (groupIds: GroupId[]) => {
    groupIds.forEach(groupId => {
      const group = ganttEntity.groups.getById(groupId)!;
      group.workTimes.forEach(item => item.calculate());
      if (Array.isArray(groupMap[group.id])) {
        groupMap[group.id].forEach(item => {
          item.x = group.workTimes.getById(item.id)!.sx;
          item.y = ganttEntity.groups.getGroupTopByIndex(ganttEntity.groups.getGroupIndex(group));
          item.height = group.height;
        });
      } else {
        groupMap[group.id] = [];
        group.workTimes.forEach(wt => {
          const item = {
            id: wt.id,
            seconds: wt.seconds,
            x: wt.sx,
            y: ganttEntity.groups.getGroupTopByIndex(ganttEntity.groups.getGroupIndex(group)),
            width: wt.width,
            height: group.height,
            timeString: wt.startTimeString,
            groupId: group.id
          };
          workTimeGrid.value.push(item);
          if (!Array.isArray(groupMap[group.id])) {
            groupMap[group.id] = [];
          }
          groupMap[group.id].push(item);
        });
      }
    });
  };

  const lazyCalculate = () => {
    lazyWorkTimeGrid.value = workTimeGrid.value.filter(item => isRectanglesOverlap({
      x1: visibleAreaStartX.value,
      y1: visibleAreaStartY.value,
      x2: visibleAreaEndX.value,
      y2: visibleAreaEndY.value
    }, {
      x1: item.x,
      y1: item.y,
      x2: item.x + item.width,
      y2: item.y + item.height
    }));
  };

  initData();
  if (lazyReady.value) {
    lazyCalculate();
  }

  const onVisibleAreaChange = () => {
    lazyCalculate();
  };
  
  const onWorkTimeGridChange = (groupIds: GroupId[]) => {
    updateData(groupIds);
    lazyCalculate();
  };

  onMounted(() => {
    bus.on(Events.VISIBLE_AREA_CHANGE, onVisibleAreaChange);
    bus.on(Events.WORK_TIME_GRID_CHANGE, onWorkTimeGridChange);
  });
  
  onBeforeUnmount(() => {
    bus.off(Events.VISIBLE_AREA_CHANGE, onVisibleAreaChange);
    bus.off(Events.WORK_TIME_GRID_CHANGE, onWorkTimeGridChange);
  });

  return {
    lazyWorkTimeGrid,
    workTimeGrid
  };
};