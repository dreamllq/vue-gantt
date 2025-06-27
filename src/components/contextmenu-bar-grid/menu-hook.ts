import { onBeforeMount, onMounted, ref } from 'vue';
import { menusEvent, menusItemType } from 'vue3-menus';
import { useStore } from '../store';
import { Events } from '@/types/events';
import { BarId } from '@/types/gantt-bar';
export const useMenuHook = () => {
  const { bus, ganttEntity } = useStore()!;
  const menusZIndex = ref(Number.MAX_SAFE_INTEGER);

  const onContextmenu = (data: {barId: BarId}, e: MouseEvent) => {
    if (Array.isArray(ganttEntity.config.contextMenuMenus)) {
      const menus: menusItemType[] = [];
      ganttEntity.config.contextMenuMenus.forEach(item => {
        if (item.click) {
          menus.push({
            ...item,
            click: (menuItem) => item.click(menuItem, data)
          });
        }
        return menus.push(item as menusItemType);
      });
      menusEvent(e, {
        menus,
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
