import { Gantt } from '@/models/gantt';
import { computed, ref } from 'vue';
import { useBus } from './bus';

export const useLayout = (ganttEntity: Gantt, store:{
    bus: ReturnType<typeof useBus>
}) => {
  const layoutReady = ref(false);
  const mainWidth = ref(0);
  const mainHeight = ref(0);
  
  const setSize = (data: {width: number, height: number}) => {
    mainWidth.value = data.width;
    mainHeight.value = data.height;
    layoutReady.value = true;

    store.bus.emit('layout-main-size-change', {
      width: data.width,
      height: data.height 
    });
  };
  return {
    layoutReady,
    mainWidth,
    mainHeight,
    setSize
  };
};