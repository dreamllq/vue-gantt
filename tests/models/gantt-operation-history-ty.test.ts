import { GanttOperationHistory } from '@/models/gantt-operation-history';
import { GanttBus } from '@/models/gantt-bus';
import { GanttBusEvents } from '@/types/gantt-bus';
import { OperationInterface } from '@/types/gantt-operation-history';

// 模拟 GanttBus
class MockGanttBus implements GanttBus {
  events: Record<string, any> = {};

  // @ts-ignore
  on(event: string, handler: ()=>void) {
    this.events[event] = handler;
  }

  trigger(event: string, ...args: any[]) {
    if (this.events[event]) {
      this.events[event](...args);
    }
  }
}

describe('GanttOperationHistory', () => {
  let bus: MockGanttBus;
  let history: GanttOperationHistory;

  beforeEach(() => {
    bus = new MockGanttBus();
    history = new GanttOperationHistory({ bus: bus as any });
  });

  test('should initialize with empty preOperations and sufOperations', () => {
    expect(history.preOperations).toEqual([]);
    expect(history.sufOperations).toEqual([]);
  });

  test('should listen for HISTORY_PUSH event and call push', () => {
    const operation: OperationInterface = {
      up: jest.fn(),
      down: jest.fn()
    };

    // 触发事件
    bus.trigger(GanttBusEvents.HISTORY_PUSH, operation);

    expect(history.preOperations).toContain(operation);
    expect(history.sufOperations).toEqual([]);
  });

  test('push should reset sufOperations and add operation to preOperations', () => {
    const operation1: OperationInterface = {
      up: jest.fn(),
      down: jest.fn() 
    };
    const operation2: OperationInterface = {
      up: jest.fn(),
      down: jest.fn() 
    };

    history.push(operation1);
    history.push(operation2);

    expect(history.preOperations).toEqual([operation1, operation2]);
    expect(history.sufOperations).toEqual([]);
  });

  test('next should shift from sufOperations, call up, and push to preOperations', () => {
    const operation: OperationInterface = {
      up: jest.fn(),
      down: jest.fn() 
    };
    history.sufOperations = [operation];

    history.next();

    expect(operation.up).toHaveBeenCalled();
    expect(history.preOperations).toContain(operation);
    expect(history.sufOperations).toEqual([]);
  });

  test('next should do nothing if sufOperations is empty', () => {
    history.next();

    expect(history.preOperations).toEqual([]);
    expect(history.sufOperations).toEqual([]);
  });

  test('back should pop from preOperations, call down, and unshift to sufOperations', () => {
    const operation: OperationInterface = {
      up: jest.fn(),
      down: jest.fn() 
    };
    history.preOperations = [operation];

    history.back();

    expect(operation.down).toHaveBeenCalled();
    expect(history.sufOperations).toContain(operation);
    expect(history.preOperations).toEqual([]);
  });

  test('back should do nothing if preOperations is empty', () => {
    history.back();

    expect(history.preOperations).toEqual([]);
    expect(history.sufOperations).toEqual([]);
  });
});