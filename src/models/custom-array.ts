import { WithId } from '@/types/biz-array';
import { Id } from '@/types/id';
import EventEmitter from 'eventemitter3';

enum Events {
  CHANGE = 'CHANGE'
}

export class CustomArray<T extends WithId> extends Array<T> {
  static Events = { CHANGE: Events.CHANGE };
  
  private _ee = new EventEmitter<Events>();
  emit = this._ee.emit.bind(this._ee);
  on = this._ee.on.bind(this._ee);
  off = this._ee.off.bind(this._ee);
  // 导致数据变化的方法：push\pop\shift\unshift\splice\
  _map = new Map<Id, T>(); 
  
  private idUniqValid(id:Id) {
    if (this._map.has(id)) {
      throw new Error(`id重复: ${id}`);
    }
  }
  push(...items:(T)[]) {
    items.forEach(item => {
      this.idUniqValid(item.id);
      this._map.set(item.id, item);
    });
    const data = super.push(...items);
    this.emit(CustomArray.Events.CHANGE, {
      addItems: items,
      deleteItems: [] 
    });
    return data;
  }
  
  pop() {
    const item = super.pop();
    if (item) {
      this._map.delete(item.id);
    }
    this.emit(CustomArray.Events.CHANGE, {
      addItems: [],
      deleteItems: [item] 
    });
    return item;
  }

  shift() {
    const item = super.shift();
    if (item) {
      this._map.delete(item.id);
    }
    this.emit(CustomArray.Events.CHANGE, {
      addItems: [],
      deleteItems: [item] 
    });
    return item;
  }

  unshift(...items: T[]) {
    items.forEach(item => {
      this.idUniqValid(item.id);
      this._map.set(item.id, item);
    });
    const data = super.unshift(...items);
    this.emit(CustomArray.Events.CHANGE, {
      addItems: items,
      deleteItems: [] 
    });
    return data;
  }

  _slice(start?: number, end?: number): T[]
  _slice(start?: number, end?: number): T[] {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const arr = this;
    const len = arr.length;

    // 处理 start
    let startIndex = start ?? 0;
    if (startIndex < 0) {
      startIndex = Math.max(0, len + startIndex);
    } else {
      startIndex = Math.min(len, Math.max(0, startIndex));
    }

    // 处理 end
    let endIndex = end ?? len;
    if (endIndex < 0) {
      endIndex = Math.max(0, len + endIndex);
    } else {
      endIndex = Math.min(len, Math.max(0, endIndex));
    }

    // 构建新数组
    const result: T[] = [];
    for (let i = startIndex; i < endIndex; i++) {
      result.push(arr[i]);
    }

    return result;
  }

    
  _splice(start: number, deleteCount?: number): T[];
  _splice(start: number, deleteCount: number, ...items: T[]): T[];
  _splice(start: number, deleteCount: number, ...items: T[]) {
    // 计算实际的起始位置（处理负数索引）
    const len = this.length;

    // 处理负索引
    if (start < 0) {
      start = len + start;
    }
    start = Math.max(0, Math.min(len, start));

    // 如果未提供 deleteCount，则默认删除从 start 开始到末尾的所有元素
    deleteCount = deleteCount === undefined ? len - start : Math.max(0, Math.min(deleteCount, len - start));

    // 记录将被移除的元素
    const removedItems = this._slice(start, start + deleteCount);

    // 删除指定数量的元素
    for (let i = start; i < start + deleteCount; i++) {
      this[i] = null as any; // 标记为要删除的元素
    }

    // 移除标记的元素
    this.sort((a, b) => b === null ? -1 : a === null ? 1 : 0); // 将所有被标记的元素移到数组末尾
    this.length -= removedItems.length; // 减少数组长度以移除元素

    // 插入新元素
    if (items.length > 0) {
      // 创建新的数组来合并原始部分、新项目和剩余部分
      const before = this._slice(0, start);
      const after = this._slice(start);
      const merged = [
        ...before,
        ...items,
        ...after
      ];
      // 更新当前实例
      this.length = 0;
      // @ts-ignore
      this.push(...merged);
    }

    return removedItems;
  }
  
  splice(start: number, deleteCount?: number): T[];
  splice(start: number, deleteCount: number, ...items: T[]): T[];
  splice(start: number, deleteCount: number, ...items: T[]) {
    const deleteItems = this._splice(start, deleteCount, ...items);
    if (Array.isArray(items)) {
      items.forEach(item => {
        this.idUniqValid(item.id);
        this._map.set(item.id, item);
      });
    }
    deleteItems.forEach(item => {
      this._map.delete(item.id);
    });
    this.emit(CustomArray.Events.CHANGE, {
      addItems: items,
      deleteItems: deleteItems
    });
    return deleteItems;
  }

  filter<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: any): S[];
  filter(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): T[];
  filter(fn:any) {
    const list:(T)[] = [];
    this.forEach(item => {
      if (fn(item)) {
        list.push(item);
      }
    });
    return list;
  }

  map<U>(callbackfn: (value: (T), index: number, array: (T)[]) => U, thisArg?: any): U[];
  map(fn:any) {
    const list:(T)[] = [];
    this.forEach(item => {
      list.push(fn(item));
    });
    return list;
  }
}