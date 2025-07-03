import { GanttBars } from '@/models/gantt-bars';
import { GanttBus } from '@/models/gantt-bus';
import { GanttConfig } from '@/models/gantt-config';

export type GanttLinksClassConstructor = {
  bars: GanttBars,
  bus: GanttBus,
  config: GanttConfig
}