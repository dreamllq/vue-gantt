import { Gantt } from '@/models/gantt';
import { GanttJsonData } from '@/types/gantt';
import { createInjectionState } from '@vueuse/core';
import { ref } from 'vue';
import { useContainer } from './hooks/container';
import { useScroll } from './hooks/scroll';

const [useProvideStore, useStore] = createInjectionState((data:GanttJsonData) => {
  const entityReady = ref(false);

  const ganttEntity = Gantt.fromJson(data);
  entityReady.value = true;

  const container = useContainer(ganttEntity);
  const scroll = useScroll(ganttEntity);

  return {
    entityReady,
    container,
    scroll,
    ganttEntity
  };
});

export { useProvideStore, useStore };