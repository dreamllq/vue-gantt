import { Id } from '@/types';
import { GanttBusEvents, GanttBusEventsInterface } from '@/types/gantt-bus';
import EventEmitter from '@/utils/eventemitter';

export class GanttBus extends EventEmitter<GanttBusEventsInterface, any> {}