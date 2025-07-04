import { Gantt } from '@/models/gantt';
import { useBus } from './bus';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { Events } from '@/types/events';
import { BarId } from '@/types/gantt-bar';
import { uniq, uniqBy } from 'lodash';
import { GanttLinkView } from '@/models/gantt-link-view';
import { GanttBarView } from '@/models/gantt-bar-view';

export const useZIndex = (ganttEntity:Gantt, store:{
    bus: ReturnType<typeof useBus>;
}) => {
  const zIndex = ref(1);

  const upZIndex = () => ++zIndex.value;

  return {
    upZIndex,
    zIndex
  };
};