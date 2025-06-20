import { Gantt } from '@/models/gantt';
import { GanttJsonData } from '@/types/gantt';
import { createInjectionState } from '@vueuse/core';
import { ref } from 'vue';
import { useContainer } from './hooks/container';
import { useScroll } from './hooks/scroll';
import { useLayout } from './hooks/layout';
import { useLazy } from './hooks/lazy';
import { useBus } from './hooks/bus';
import { useDrag } from './hooks/drag';
import { v4 as uuidv4 } from 'uuid';

const [useProvideStore, useStore] = createInjectionState((data:GanttJsonData) => {
  const ganttId = uuidv4();
  const entityReady = ref(false);

  const ganttEntity = Gantt.fromJson(data);
  console.log(ganttEntity);
  
  entityReady.value = true;

  const bus = useBus();
  const container = useContainer(ganttEntity, { bus });
  const drag = useDrag(ganttEntity, { bus });
  const layout = useLayout(ganttEntity, { bus });
  const scroll = useScroll(ganttEntity, { bus });
  const lazy = useLazy(ganttEntity, {
    scroll,
    layout,
    bus
  });

  return {
    ganttId,
    entityReady,
    ganttEntity,
    bus,
    container,
    drag,
    layout,
    scroll,
    lazy
  };
});

export { useProvideStore, useStore };