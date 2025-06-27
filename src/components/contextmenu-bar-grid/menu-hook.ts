import { onBeforeMount, onMounted, ref } from 'vue';
import { menusEvent } from 'vue3-menus';
import { useStore } from '../store';
import { Events, Id } from '@/types';
export const useMenuHook = () => {
  const { bus, ganttEntity } = useStore()!;
  const menusZIndex = ref(Number.MAX_SAFE_INTEGER);

  const onContextmenu = (data: {barId: Id}, e: MouseEvent) => {
    if (Array.isArray(ganttEntity.config.contextMenuMenus)) {
      menusEvent(e, {
        menus: ganttEntity.config.contextMenuMenus.map(item => {
          if (item.click) {
            return {
              ...item,
              click: (menuItem) => item.click(menuItem, data)
            };
          }
          return item;
        }),
        zIndex: menusZIndex.value
      }, null);
    }
  };

  onMounted(() => {
    bus.on(Events.BAR_CONTEXTMENU, onContextmenu);
  });

  onBeforeMount(() => {
    bus.off(Events.BAR_CONTEXTMENU, onContextmenu);
  });
};
