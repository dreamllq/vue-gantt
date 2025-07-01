import { Ref, ref } from 'vue';
import { Gantt } from '@/models/gantt';
import { useBus } from './bus';
import { Events } from '@/types/events';

export const useContainer = (ganttEntity: Gantt, store:{
  bus: ReturnType<typeof useBus>
}) => {
  const containerReady = ref(false);
  let containerRef:Ref<HTMLElement | undefined> | undefined;

  const setRef = (ref: Ref<HTMLElement | undefined>) => {
    containerRef = ref;
  };
  const setSize = (data: {width: number, height: number}) => {
    ganttEntity.container.width = data.width;
    ganttEntity.container.height = data.height;

    containerReady.value = true;
    
    store.bus.emit(Events.CONTAINER_SIZE_CHANGE, {
      width: data.width,
      height: data.height 
    });
  };

  const getBoundingClientRect = () => containerRef?.value?.getBoundingClientRect();

  return {
    containerReady,
    setSize,
    setRef,
    getBoundingClientRect
  };
};