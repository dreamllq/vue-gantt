import { GanttOperationHistoryClassConstructor, OperationInterface } from '@/types/gantt-operation-history';
import { GanttBus } from './gantt-bus';
import { GanttBusEvents } from '@/types/gantt-bus';

export class GanttOperationHistory {
  bus:GanttBus;
  preOperations: OperationInterface[] = [];
  sufOperations: OperationInterface[] = [];

  constructor(data: GanttOperationHistoryClassConstructor) {
    this.bus = data.bus;

    this.bus.on(GanttBusEvents.HISTORY_PUSH, (operation) => {
      this.push(operation);
    });
  }
  push(operation: OperationInterface) {
    this.sufOperations = [];
    this.preOperations.push(operation);
  }

  next() {
    const operation = this.sufOperations.shift();
    if (operation) {
      operation.up();
      this.preOperations.push(operation);
    }
  }

  back() {
    const operation = this.preOperations.pop();
    if (operation) {
      operation.down();
      this.sufOperations.unshift(operation);
    }
  }
}