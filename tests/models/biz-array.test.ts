import { BizArray } from '@/models/biz-array';
import { Id } from '@/types';

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
  });
});