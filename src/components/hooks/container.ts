import { ref } from 'vue';
import { Gantt } from '@/models/gantt';
import { useBus } from './bus';

export const useContainer = (ganttEntity: Gantt, store:{
  bus: ReturnType<typeof useBus>
}) => {
  const containerReady = ref(false);
  const setSize = (data: {width: number, height: number}) => {
    ganttEntity.container.width = data.width;
    ganttEntity.container.height = data.height;

    containerReady.value = true;
    
    store.bus.emit('container-size-change', {
      width: data.width,
      height: data.height 
    });
  };

  return {
    containerReady,
    setSize
  };
};