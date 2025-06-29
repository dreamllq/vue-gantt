import { Id } from '@/types/id';
import EventEmitter from 'eventemitter3';
const ee = new EventEmitter();

export default {
  emit: ee.emit.bind(ee),
  on: ee.on.bind(ee),
  off: ee.off.bind(ee)
};
export class BizArray<T> extends Array<T & {id: Id}> {
  static Events = { CHANGE: 'CHANGE' };

  private _ee: EventEmitter = new EventEmitter();
  emit = this._ee.emit.bind(this._ee);
  on = this._ee.on.bind(this._ee);
  off = this._ee.off.bind(this._ee);

  // 导致数据变化的方法：push\pop\shift\unshift\splice\
  _map = new Map<Id, T & {id: Id}>(); 

  private idUniqValid(id:Id) {
    if (this._map.has(id)) {
      throw new Error(`id重复: ${id}`);
    }
  }

  isExist(id:Id) {
    return this._map.has(id);
  }

  getById(id: Id) {
    return this._map.get(id);
  }

  getIds() {
    return this.map(item => item.id);
  }

  removeById(id: Id) {
    const index = this.findIndex(item => item.id === id);
    this.splice(index, 1);
  }

  push(...items:(T & { id: Id })[]) {
    items.forEach(item => {
      this.idUniqValid(item.id);
      this._map.set(item.id, item);
    });
    const data = super.push(...items);
    this.emit(BizArray.Events.CHANGE);
    return data;
  }
  
  pop() {
    const item = super.pop();
    if (item) {
      this._map.delete(item.id);
    }
    this.emit(BizArray.Events.CHANGE);
    return item;
  }

  shift() {
    const item = super.shift();
    if (item) {
      this._map.delete(item.id);
    }
    this.emit(BizArray.Events.CHANGE);
    return item;
  }

  unshift(...items: (T & { id: Id; })[]) {
    items.forEach(item => {
      this.idUniqValid(item.id);
      this._map.set(item.id, item);
    });
    this.emit(BizArray.Events.CHANGE);
    const data = super.unshift(...items);
    this.emit(BizArray.Events.CHANGE);
    return data;
  }
  
  splice(start: number, deleteCount?: number): (T & { id: Id; })[];
  splice(start: number, deleteCount: number, ...items: (T & { id: Id; })[]): (T & { id: Id; })[];
  splice(start: number, deleteCount: number, ...items: (T & { id: Id; })[]) {
    const deleteItems = super.splice(start, deleteCount, ...items);
    if (Array.isArray(items)) {
      items.forEach(item => {
        this.idUniqValid(item.id);
        this._map.set(item.id, item);
      });
    }
    deleteItems.forEach(item => {
      this._map.delete(item.id);
    });
    this.emit(BizArray.Events.CHANGE);
    return deleteItems;
  }

  filter<S extends (T & { id: Id; })>(predicate: (value: (T & { id: Id; }), index: number, array: (T & { id: Id; })[]) => value is S, thisArg?: any): S[];
  filter(predicate: (value: (T & { id: Id; }), index: number, array: (T & { id: Id; })[]) => unknown, thisArg?: any): T[];
  filter(fn:any) {
    const list:(T & {id: Id})[] = [];
    this.forEach(item => {
      if (fn(item)) {
        list.push(item);
      }
    });
    return list;
  }

  map<U>(callbackfn: (value: (T & {id: Id}), index: number, array: (T & {id: Id})[]) => U, thisArg?: any): U[];
  map(fn:any) {
    const list:(T & {id: Id})[] = [];
    this.forEach(item => {
      list.push(fn(item));
    });
    return list;
  }
}