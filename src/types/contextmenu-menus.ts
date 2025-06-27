import { menusItemType as vueMenusItemType } from 'vue3-menus';
import { Id } from './id';

export type menusItemType = Omit<vueMenusItemType, 'click'> & {
  click: (menu: vueMenusItemType, data:{barId: Id}) => unknown
}