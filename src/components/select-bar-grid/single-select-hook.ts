import { onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue';
import { useStore } from '../store';
import dom from '@/utils/dom';
import { GanttBarView } from '@/models/gantt-bar-view';

export const useSingleSelectHook = () => {
  const { bus, ganttEntity } = useStore()!;
  const selectedBar = ref<GanttBarView>();
  const onClick = (e:MouseEvent) => {
    const domPath = dom.getPath(e.target);
    const barTarget = domPath.find(p => p.classList && p.classList.contains('gantt-bar-cell')) as HTMLElement;
    // console.log('onDragStart', barTarget, barTarget.dataset.id);
    if (barTarget) {
      const type = barTarget.dataset.type as string;
      const id = type === 'number' ? Number(barTarget.dataset.id) : barTarget.dataset.id as Id;
      const bar = ganttEntity.bars.getById(id);
          
      if (bar) {
        if (selectedBar.value) {
          selectedBar.value.selected = false;
          if (selectedBar.value.id !== bar.id) {
            selectedBar.value = bar;
            selectedBar.value.selected = true;
          } else {
            selectedBar.value = undefined;
          }
        } else {
          selectedBar.value = bar;
          selectedBar.value.selected = true;
        }
        bus.emit('bar-change', [bar.id]);
        bus.emit('bar-select-change', [bar.id]);
      } 
    }
  };

  onMounted(() => {
    bus.on('click', onClick);
  });

  onBeforeUnmount(() => {
    bus.off('click', onClick);
  });
};