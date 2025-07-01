import { OperationInterface } from '@/types/gantt-operation-history';

export class GanttOperationHistory {
  preOperations: OperationInterface[] = [];
  sufOperations: OperationInterface[] = [];

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