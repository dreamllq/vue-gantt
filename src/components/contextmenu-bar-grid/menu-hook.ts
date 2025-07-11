import { nextTick, onBeforeMount, onMounted, ref } from 'vue';
import { menusItemType } from 'vue3-menus';
import { useStore } from '../store';
import { Events } from '@/types/events';
import { BarId } from '@/types/gantt-bar';
export const useMenuHook = () => {
  const { bus, ganttEntity } = useStore()!;
  const menusZIndex = ref(Number.MAX_SAFE_INTEGER);
  
  const menus = ref<menusItemType[]>([]);
  const eventVal = ref<MouseEvent>({} as MouseEvent);
  const isOpen = ref(false);
  
  const onContextmenu = async (data: {barId: BarId}, e: MouseEvent) => {
    isOpen.value = false;
    eventVal.value = {} as MouseEvent;
    await nextTick();
    if (Array.isArray(ganttEntity.config.contextMenuMenus)) {
      const _menus: menusItemType[] = [];
      ganttEntity.config.contextMenuMenus.forEach(item => {
        if (item.click) {
          _menus.push({
            ...item,
            click: (menuItem) => {
              item.click(menuItem, data);
            }
          });
        } else {
          return _menus.push(item as menusItemType);
        }
      });

      menus.value = _menus;
      eventVal.value = e;
      isOpen.value = true;
    }
  };

  onMounted(() => {
    bus.on(Events.BAR_CONTEXTMENU, onContextmenu);
  });

  onBeforeMount(() => {
    bus.off(Events.BAR_CONTEXTMENU, onContextmenu);
  });

  return {
    menus,
    eventVal,
    isOpen,
    menusZIndex
  };
};
