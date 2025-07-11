import { Gantt } from '@/models/gantt';
import { GanttHook, GanttJsonData } from '@/types/gantt';
import { createInjectionState } from '@vueuse/core';
import { nextTick, ref, watch } from 'vue';
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
import { useZIndex } from './hooks/z-index';
import { Events } from '@/types/events';
import { debounce } from 'lodash';

const [useProvideStore, useStore] = createInjectionState((data:GanttJsonData, options: {hook?:GanttHook} = {}) => {
  const ganttId = uuidv4();
  const barHtmlClass = '__gantt-bar-cell__';
  const entityReady = ref(false);

  const ganttEntity = Gantt.fromJson(data, { hook: options.hook });
  console.log(ganttEntity);
  
  entityReady.value = true;

  const bus = useBus();
  const container = useContainer(ganttEntity, { bus });
  const drag = useDrag(ganttEntity, { bus });
  const layout = useLayout(ganttEntity, { bus });
  const scroll = useScroll(ganttEntity, { bus });
  const zIndex = useZIndex(ganttEntity, { bus });
  const lazy = useLazy(ganttEntity, {
    scroll,
    layout,
    bus
  });

  useEvents(ganttEntity, { bus });
  watch(() => entityReady.value && container.containerReady.value && scroll.scrollReady.value && layout.layoutReady.value, (val) => {
    if (val === true) {
      bus.emit(Events.READY);
    }
  });

  const containerReload = async () => {
    container.containerReady.value = false;
    scroll.scrollReady.value = false;
    layout.layoutReady.value = false;
    scroll.scrollLeft.value = 0;
    scroll.scrollTop.value = 0;
    await nextTick();
    ganttEntity.calculate();
    container.containerReady.value = true;
    scroll.revertPos();
  };

  const onContainerSizeChange = debounce(async () => {
    scroll.saveCurrentPos();
    container.containerReady.value = false;
    scroll.scrollReady.value = false;
    layout.layoutReady.value = false;
    scroll.scrollLeft.value = 0;
    scroll.scrollTop.value = 0;
    await nextTick();
    container.containerReady.value = true;
    scroll.revertPos();
  }, 0);

  const onMounted = () => {
    ganttEntity.config.on(GanttConfig.Events.DATA_SCALE_UNIT_CHANGE, containerReload);
    ganttEntity.layoutConfig.on(GanttLayoutConfig.Events.SIZE_RATIO_PERCENT_CHANGE, containerReload);
    ganttEntity.config.on(GanttConfig.Events.SHOW_ATTACHED_BARS_CHANGE, containerReload); 
    bus.on(Events.CONTAINER_SIZE_CHANGE, onContainerSizeChange);
  };
  const onUnmounted = () => {
    ganttEntity.config.off(GanttConfig.Events.DATA_SCALE_UNIT_CHANGE, containerReload);
    ganttEntity.layoutConfig.off(GanttLayoutConfig.Events.SIZE_RATIO_PERCENT_CHANGE, containerReload);
    ganttEntity.config.off(GanttConfig.Events.SHOW_ATTACHED_BARS_CHANGE, containerReload);
    bus.off(Events.CONTAINER_SIZE_CHANGE, onContainerSizeChange);
  };
  

  return {
    onMounted,
    onUnmounted,
    ganttId,
    barHtmlClass,
    entityReady,
    ganttEntity,
    bus,
    container,
    drag,
    layout,
    scroll,
    zIndex,
    lazy
  };
});

export { useProvideStore, useStore };