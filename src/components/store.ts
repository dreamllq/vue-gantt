import { Gantt } from '@/models/gantt';
import { GanttJsonData } from '@/types/gantt';
import { createInjectionState } from '@vueuse/core';
import { ref } from 'vue';
import { useContainer } from './hooks/container';
import { useScroll } from './hooks/scroll';
import { useTimeLine } from './hooks/time-line';
import { useLayout } from './hooks/layout';
import { useLazy } from './hooks/lazy';
import { useBus } from './hooks/bus';

const [useProvideStore, useStore] = createInjectionState((data:GanttJsonData) => {
  const entityReady = ref(false);

  const ganttEntity = Gantt.fromJson(data);
  entityReady.value = true;

  const bus = useBus();
  const container = useContainer(ganttEntity, { bus });
  const layout = useLayout(ganttEntity, { bus });
  const scroll = useScroll(ganttEntity, { bus });
  const lazy = useLazy(ganttEntity, {
    scroll,
    layout,
    bus
  });
  const timeLine = useTimeLine(ganttEntity, {
    lazy,
    bus 
  });

  return {
    entityReady,
    ganttEntity,
    bus,
    container,
    layout,
    scroll,
    timeLine,
    lazy
  };
});

export { useProvideStore, useStore };