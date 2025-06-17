import { ref } from 'vue';
import bus from '@/utils/bus';
import { Gantt } from '@/models/gantt';

export const useContainer = (ganttEntity: Gantt) => {
  const containerReady = ref(false);
  const setContainerSize = (data: {width: number, height: number}) => {
    ganttEntity.container.width = data.width;
    ganttEntity.container.height = data.height;

    containerReady.value = true;
    
    bus.emit('container-change', {
      width: data.width,
      height: data.height 
    });
  };

  return {
    containerReady,
    setContainerSize
  };
};