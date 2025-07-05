import { Id } from '@/types/id';
import { CustomArray } from './custom-array';
import { WithId } from '@/types/biz-array';
export class BizArray<T extends WithId> extends CustomArray<T> {
  isExist(id:Id) {
    return this._map.has(id);
  }

  getById(id: Id) {
    return this._map.get(id);
  }

  getIds() {
    return super.map(item => item.id);
  }

  getIndexById(id:Id) {
    return super.findIndex(item => item.id === id);
  }

  removeById(id: Id) {
    if (this.isExist(id)) {
      const index = this.getIndexById(id);
      super.splice(index, 1);
    } else {
      throw new Error(`id:${id} 数据不存在`);
    }
  }
}