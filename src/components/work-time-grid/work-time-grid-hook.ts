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
  const groupMap:Record<GroupId, GridItem[]> = {};


  const { ganttEntity, lazy, bus } = useStore()!;
  const { visibleAreaStartX, visibleAreaEndX, visibleAreaStartY, visibleAreaEndY, lazyReady } = lazy;

  const initData = () => {
    workTimeGrid.value = [];
    ganttEntity.workTimes
      .filter(item => item.isShow)
      .forEach(wt => {
        const item = {
          id: wt.id,
          seconds: wt.seconds,
          x: wt.sx,
          y: ganttEntity.groups.getGroupTopByIndex(ganttEntity.groups.getGroupIndex(ganttEntity.groups.getById(wt.group.id)!)),
          width: wt.width,
          height: ganttEntity.groups.getById(wt.group.id)!.height,
          timeString: wt.startTimeString,
          groupId: wt.group.id
        };
        workTimeGrid.value.push(item);
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
  

  const onWorkTimeChange = () => {
    initData();
    lazyCalculate();
  };

  onMounted(() => {
    bus.on(Events.VISIBLE_AREA_CHANGE, onVisibleAreaChange);
    bus.on(Events.WORK_TIME_CHANGE, onWorkTimeChange);
  });
  
  onBeforeUnmount(() => {
    bus.off(Events.VISIBLE_AREA_CHANGE, onVisibleAreaChange);
    bus.off(Events.WORK_TIME_CHANGE, onWorkTimeChange);
  });

  return {
    lazyWorkTimeGrid,
    workTimeGrid
  };
};