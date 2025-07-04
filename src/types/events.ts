import { GanttBarView } from '@/models/gantt-bar-view';
import { BarId } from './gantt-bar';
import { Id } from './id';
import { Unit } from './unit';
import { GroupId } from './gantt-group';
import { AttachedBarId } from './gantt-attached-bar';

export enum Events {
  DRAGSTART='DRAGSTART',
  DRAG='DRAG',
  DRAGEND='DRAGEND',
  CLICK='CLICK',
  CONTEXTMENU='CONTEXTMENU',
  WHEEL='WHEEL',
  MOUSE_OUTSIDE='MOUSE_OUTSIDE',
  MOUSE_MAIN_OUTSIDE='MOUSE_MAIN_OUTSIDE',
  CONTAINER_SIZE_CHANGE='CONTAINER_SIZE_CHANGE',
  LAYOUT_MAIN_SIZE_CHANGE='LAYOUT_MAIN_SIZE_CHANGE',
  VISIBLE_AREA_CHANGE='VISIBLE_AREA_CHANGE',
  

  DRAGGABLE_CHANGE='DRAGGABLE_CHANGE',
  SELECTABLE_CHANGE='SELECTABLE_CHANGE',
  MULTIPLE_SELECTABLE_CHANGE='MULTIPLE_SELECTABLE_CHANGE',
  DATA_SCALE_UNIT_CHANGE='DATA_SCALE_UNIT_CHANGE',

  SCROLL_CHANGE='SCROLL_CHANGE',
  AUTO_SCROLL_CHANGE='AUTO_SCROLL_CHANGE',

  LAYOUT_CHANGE='LAYOUT_CHANGE',

  DATE_GRID_CHANGE='DATE_GRID_CHANGE',

  WORK_TIME_GRID_CHANGE='WORK_TIME_GRID_CHANGE',

  GROUP_CHANGE='GROUP_CHANGE',
  GROUP_EXPAND_CHANGE='GROUP_EXPAND_CHANGE',

  BARS_CHANGE='BARS_CHANGE',

  BAR_DRAGSTART='BAR_DRAGSTART',
  BAR_DRAG='BAR_DRAG',
  BAR_DRAGEND='BAR_DRAGEND',
  BAR_CLICK='BAR_CLICK',
  BAR_CLICK_OUTSIDE='BAR_CLICK_OUTSIDE',
  BAR_CHANGE='BAR_CHANGE',
  BAR_CHANGE_FRAGMENTATION='BAR_CHANGE_FRAGMENTATION',
  BAR_DRAGGING='BAR_DRAGGING',
  BAR_DRAGGING_CHANGE='BAR_DRAGGING_CHANGE',
  BAR_SELECT_CHANGE='BAR_SELECT_CHANGE',
  BAR_POS_CHANGE='BAR_POS_CHANGE',
  BAR_POS_CHANGE_FRAGMENTATION='BAR_POS_CHANGE_FRAGMENTATION',
  BAR_CONTEXTMENU='BAR_CONTEXTMENU',
  BAR_VISIBLE_CHANGE='BAR_VISIBLE_CHANGE',
  BAR_LAZY_CHANGE='BAR_LAZY_CHANGE',

  LINKS_CHANGE='BARS_CHANGE',

  ATTACHED_BAR_CHANGE='ATTACHED_BAR_CHANGE',
  ATTACHED_BAR_POS_CHANGE='ATTACHED_BAR_POS_CHANGE',
  ATTACHED_BAR_VISIBLE_CHANGE='ATTACHED_BAR_VISIBLE_CHANGE'
}

export interface EventsInterface {
  [Events.DRAGSTART]: (e:MouseEvent)=>void;
  [Events.DRAG]: (e:MouseEvent)=>void;
  [Events.DRAGEND]: (e:MouseEvent)=>void;
  [Events.CLICK]: (e:MouseEvent)=>void;
  [Events.CONTEXTMENU]: (e:MouseEvent)=>void;
  [Events.WHEEL]: (e:MouseEvent)=>void;
  [Events.MOUSE_OUTSIDE]: ()=>void;
  [Events.MOUSE_MAIN_OUTSIDE]: ()=>void;
  [Events.CONTAINER_SIZE_CHANGE]: (data:{width:number, height: number})=>void;
  [Events.LAYOUT_MAIN_SIZE_CHANGE]: (data:{width:number, height: number})=>void;
  [Events.VISIBLE_AREA_CHANGE]: ()=>void;

  [Events.DRAGGABLE_CHANGE]: (val:boolean)=>void;
  [Events.SELECTABLE_CHANGE]: (val:boolean)=>void;
  [Events.MULTIPLE_SELECTABLE_CHANGE]: (val:boolean)=>void;
  [Events.DATA_SCALE_UNIT_CHANGE]: (val:Unit)=>void;

  [Events.SCROLL_CHANGE]: ()=>void;
  [Events.AUTO_SCROLL_CHANGE]: ()=>void;

  [Events.LAYOUT_CHANGE]: ()=>void;

  [Events.DATE_GRID_CHANGE]: ()=>void;

  [Events.WORK_TIME_GRID_CHANGE]: (groupIds:GroupId[])=>void;

  [Events.GROUP_CHANGE]: (groupIds:GroupId[])=>void;
  [Events.GROUP_EXPAND_CHANGE]: (data: { oldGroupIds: GroupId[]; newGroupIds: GroupId[]; addGroupIds: GroupId[]; deleteGroupIds: GroupId[] })=>void;
  
  [Events.BARS_CHANGE]: ()=>void;

  [Events.BAR_DRAGSTART]:(e:MouseEvent, bar: GanttBarView)=>void;
  [Events.BAR_DRAG]: (e:MouseEvent, bar: GanttBarView)=>void;
  [Events.BAR_DRAGEND]: (e:MouseEvent, bar: GanttBarView)=>void;
  [Events.BAR_CLICK]: (e:MouseEvent, bar: GanttBarView)=>void;
  [Events.BAR_CLICK_OUTSIDE]: (e:MouseEvent)=>void;
  [Events.BAR_CHANGE]:(ids: BarId[])=>void;
  [Events.BAR_CHANGE_FRAGMENTATION]: (ids: BarId[])=>void;
  [Events.BAR_DRAGGING]: (ids: BarId[])=>void;
  [Events.BAR_DRAGGING_CHANGE]: (ids: BarId[], dragging: boolean)=>void;
  [Events.BAR_SELECT_CHANGE]: (ids: BarId[])=>void;
  [Events.BAR_POS_CHANGE]: (ids: BarId[])=>void;
  [Events.BAR_POS_CHANGE_FRAGMENTATION]: (ids: BarId[])=>void;
  [Events.BAR_CONTEXTMENU]: (data: {barId: BarId}, e: MouseEvent)=>void;
  [Events.BAR_VISIBLE_CHANGE]: ()=>void;
  [Events.BAR_LAZY_CHANGE]: (ids: BarId[])=>void;

  [Events.LINKS_CHANGE]: ()=>void;

  [Events.ATTACHED_BAR_CHANGE]: (ids: AttachedBarId[])=>void;
  [Events.ATTACHED_BAR_POS_CHANGE]: (ids: AttachedBarId[])=>void;
  [Events.ATTACHED_BAR_VISIBLE_CHANGE]: ()=>void;
}