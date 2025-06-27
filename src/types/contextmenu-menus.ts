import { menusItemType as vueMenusItemType } from 'vue3-menus';
import { BarId } from './gantt-bar';

export type menusItemType = Omit<vueMenusItemType, 'click'> & {
  click: (menu: vueMenusItemType, data:{barId: BarId}) => unknown
}