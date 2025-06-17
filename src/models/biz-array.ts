import { Id } from '@/types/id';

export class BizArray<T> extends Array<T & {id: Id}> {
  getById(id: Id) {
    return this.find(item => item.id === id);
  }

  removeById(id: Id) {
    const index = this.findIndex(item => item.id === id);
    this.splice(index, 1);
  }
}