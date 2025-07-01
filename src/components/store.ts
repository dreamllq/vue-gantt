import { Gantt } from '@/models/gantt';
import { GanttJsonData } from '@/types/gantt';
import { createInjectionState } from '@vueuse/core';
import { nextTick, ref } from 'vue';
import { useContainer } from './hooks/container';
import { useScroll } from './hooks/scroll';
import { useLayout } from './hooks/layout';
import { useLazy } from './hooks/lazy';
import { useBus } from './hooks/bus';
import { useDrag } from './hooks/drag';
import { v4 as uuidv4 } from 'uuid';
import { useEvents } from './hooks/events';
import { GanttConfig } from '@/models/gantt-config';
import { GanttLayoutConfig } from '@/models/gantt-layout-config';

const [useProvideStore, useStore] = createInjectionState((data:GanttJsonData) => {
  const ganttId = uuidv4();
  const barHtmlClass = '__gantt-bar-cell__';
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

  useEvents(ganttEntity, { bus });

  const containerReload = async () => {
    container.containerReady.value = false;
    scroll.scrollReady.value = false;
    layout.layoutReady.value = false;
    await nextTick();
    ganttEntity.groups.calculate();
    ganttEntity.bars.calculate();
    ganttEntity.attachedBars.calculate();
    ganttEntity.links.calculate();
    container.containerReady.value = true;
  };
  
  ganttEntity.config.on(GanttConfig.Events.DATA_SCALE_UNIT_CHANGE, containerReload);
  ganttEntity.layoutConfig.on(GanttLayoutConfig.Events.SIZE_RATIO_PERCENT_CHANGE, containerReload);

  return {
    ganttId,
    barHtmlClass,
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