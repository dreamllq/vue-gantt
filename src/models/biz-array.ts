import { Id } from '@/types/id';

export class BizArray<T> extends Array<T & {id: Id}> {

  // 导致数据变化的方法：push\pop\shift\unshift\splice\
  _map = new Map<Id, T & {id: Id}>(); 
  getById(id: Id) {
    // return this.find(item => item.id === id);
    return this._map.get(id);
  }

  removeById(id: Id) {
    const index = this.findIndex(item => item.id === id);
    this.splice(index, 1);
  }

  push(...items:(T & { id: Id })[]) {
    items.forEach(item => {
      this._map.set(item.id, item);
    });
    return super.push(...items);
  }
  
  pop() {
    const item = super.pop();
    if (item) {
      this._map.delete(item.id);
    }
    return item;
  }

  shift() {
    const item = super.shift();
    if (item) {
      this._map.delete(item.id);
    }
    return item;
  }

  unshift(...items: (T & { id: Id; })[]) {
    items.forEach(item => {
      this._map.set(item.id, item);
    });
    return super.unshift(...items);
  }
  
  splice(start: number, deleteCount?: number): (T & { id: Id; })[];
  splice(start: number, deleteCount: number, ...items: (T & { id: Id; })[]): (T & { id: Id; })[];
  splice(start: number, deleteCount: number, ...items: (T & { id: Id; })[]) {
    const deleteItems = super.splice(start, deleteCount, ...items);
    if (Array.isArray(items)) {
      items.forEach(item => {
        this._map.set(item.id, item);
      });
    }
    deleteItems.forEach(item => {
      this._map.delete(item.id);
    });
    return deleteItems;
  }
}