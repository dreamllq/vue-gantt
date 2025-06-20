export type GanttLayoutConfigClassConstructor = {
  HEADER_HEIGHT?: number;
  ROW_HEIGHT?: number;
  TIME_UNIT_WIDTH?: number;
  SCROLL_WIDTH?: number;
  SCROLL_HEIGHT?: number;
  GRID_HEAD_CELL_WIDTH?: number;
  BAR_HEIGHT?: number;
  GRID_CELL_WIDTH?: number;
  MILESTONE_WIDTH?: number;
  TASK_CENTER_TOP?: number; // 任务中心高度
  SHOW_ATTACHED_TASK_TASK_CENTER_TOP?: number; // 显示附属任务时，任务中心的高度
  ATTACHED_BAR_HEIGHT?: number;
  ATTACHED_TASK_CENTER_TOP?: number; // 附属任务中心高度
}