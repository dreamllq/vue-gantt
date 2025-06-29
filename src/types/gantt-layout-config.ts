export type GanttLayoutConfigClassConstructor = {
  sizeRatioPercent?:number;
  HEADER_HEIGHT?: number;
  ROW_HEIGHT?: number;
  TIME_UNIT_WIDTH?: number;
  SCROLL_WIDTH?: number;
  SCROLL_HEIGHT?: number;
  GRID_HEAD_CELL_WIDTH?: number;
  BAR_HEIGHT?: number;
  GRID_CELL_WIDTH?: number;
  MILESTONE_WIDTH?: number;
  BAR_CENTER_TOP?: number; // 任务中心高度
  SHOW_ATTACHED_BAR_BAR_CENTER_TOP?: number; // 显示附属任务时，任务中心的高度
  ATTACHED_BAR_HEIGHT?: number;
  ATTACHED_ROW_HEIGHT?: number;
  ATTACHED_BAR_CENTER_TOP?: number; // 附属任务中心高度
  AUTO_SCROLL_AREA_SIZE?:number;
  AUTO_SCROLL_INTERVAL_MS?: number;
  AUTO_SCROLL_SHIFT_AMOUNT_Y?: number;
  AUTO_SCROLL_SHIFT_AMOUNT_X?: number;
}