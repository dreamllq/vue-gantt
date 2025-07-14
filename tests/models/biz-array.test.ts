import { Id } from '@/index';
import { BizArray } from '@/models/biz-array';

describe('biz-array', () => {
  test('getById', () => {
    const ba = new BizArray<{id: Id, a: string}>();
    ba.push({
      id: 1,
      a: 'a' 
    });
    ba.push({
      id: 2,
      a: 'b' 
    });

    expect(ba.length).toBe(2);

    expect(ba.getById(1)!.a).toBe('a');
    expect(ba.getById(2)!.a).toBe('b');
  });

  test('removeById', () => {
    const ba = new BizArray<{id: Id, a: string}>();
    ba.push({
      id: 1,
      a: 'a' 
    });
    ba.push({
      id: 2,
      a: 'b' 
    });

    expect(ba.length).toBe(2);
    ba.removeById(2);
    expect(ba.length).toBe(1);
    expect(ba[0].a).toBe('a');
    expect(() => {
      ba.removeById(3);
    }).toThrowError('id:3 数据不存在');
  });

  test('isExist', () => {
    const ba = new BizArray<{id: Id, a: string}>();
    ba.push({
      id: 1,
      a: 'a' 
    });
    ba.push({
      id: 2,
      a: 'b' 
    });

    expect(ba.isExist(1)).toBe(true);
    expect(ba.isExist(3)).toBe(false);
  });

  test('getIds', () => {

    const ba = new BizArray<{id: Id, a: string}>();
    ba.push({
      id: 1,
      a: 'a' 
    });
    ba.push({
      id: 2,
      a: 'b' 
    });

    expect(ba.getIds()).toEqual([1, 2]);
  });

  test('getIndexById', () => { 
    const ba = new BizArray<{id: Id, a: string}>();
    ba.push({
      id: 1,
      a: 'a' 
    });
    ba.push({
      id: 2,
      a: 'b' 
    });

    expect(ba.getIndexById(1)).toEqual(0);
    expect(ba.getIndexById(2)).toEqual(1);
  });
});