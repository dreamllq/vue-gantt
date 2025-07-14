import { Id } from '@/index';
import { CustomArray } from '@/models/custom-array';

describe('biz-array', () => {
  test('push', () => {
    const arr = new CustomArray<{id: Id, name: string}>();
    arr.push({
      id: '1',
      name: '1' 
    });
    expect(arr.length).toBe(1);
    expect(arr[0]).toEqual({
      id: '1',
      name: '1'
    });
    expect(arr._map.get('1')).toEqual({
      id: '1',
      name: '1'
    });

    expect(() => {
      arr.push({
        id: '1',
        name: '1' 
      });
    }).toThrowError('id重复: 1');
  });

  test('pop', () => {
    const arr = new CustomArray<{id: Id, name: string}>();
    arr.push({
      id: '1',
      name: '1' 
    });
    arr.push({
      id: '2',
      name: '2' 
    });
    arr.pop();
    expect(arr[0]).toEqual({
      id: '1',
      name: '1'
    });
    expect(arr.length).toBe(1);
    expect(arr._map.get('2')).toBe(undefined);
    expect(arr._map.get('1')).toEqual({
      id: '1',
      name: '1'
    });
  });

  test('unshift', () => {
    const arr = new CustomArray<{id: Id, name: string}>();
    arr.unshift({
      id: '1',
      name: '1' 
    });
    expect(arr.length).toBe(1);
    expect(arr[0]).toEqual({
      id: '1',
      name: '1'
    });
    expect(arr._map.get('1')).toEqual({
      id: '1',
      name: '1'
    });

    expect(() => {
      arr.unshift({
        id: '1',
        name: '1' 
      });
    }).toThrowError('id重复: 1');
  });

  test('shift', () => {
    const arr = new CustomArray<{id: Id, name: string}>();
    arr.push({
      id: '1',
      name: '1' 
    });
    arr.push({
      id: '2',
      name: '2' 
    });
    arr.shift();
    expect(arr[0]).toEqual({
      id: '2',
      name: '2'
    });
    expect(arr.length).toBe(1);
    expect(arr._map.get('1')).toBe(undefined);
    expect(arr._map.get('2')).toEqual({
      id: '2',
      name: '2'
    });
  });

  test('splice1', () => {
    const arr = new CustomArray<{id: Id, name: string}>();
    arr.push({
      id: '1',
      name: '1' 
    });
    arr.push({
      id: '2',
      name: '2' 
    });

    expect(arr._map.size).toBe(2);
    arr.splice(0, 1);
    expect(arr.length).toBe(1);
    expect(arr._map.size).toBe(1);
    expect(arr._map.has('1')).toBe(false);
    expect(arr._map.get('2')).toEqual({
      id: '2',
      name: '2'
    });
    expect(arr[0]).toEqual({
      id: '2',
      name: '2'
    });
  });

  test('splice2', () => {
    const arr = new CustomArray<{id: Id, name: string}>();
    arr.push({
      id: '1',
      name: '1' 
    });
    
    arr.push({
      id: '2',
      name: '2' 
    });

    arr.splice(0, 1, {
      id: '3',
      name: '3' 
    });
    expect(arr.length).toBe(2);
    expect(arr[0]).toEqual({
      id: '3',
      name: '3'
    });
  });

  test('filter', () => {
    const arr = new CustomArray<{id: Id, name: string}>();
    arr.push({
      id: '1',
      name: '1' 
    });
    
    arr.push({
      id: '2',
      name: '2' 
    });
    
    const filter = arr.filter(item => item.id === '1');
    expect(filter.length).toBe(1);
    expect(filter[0]).toEqual({
      id: '1',
      name: '1'
    });
  });

  test('map', () => {

    const arr = new CustomArray<{id: Id, name: string}>();
    arr.push({
      id: '1',
      name: '1' 
    });
    
    arr.push({
      id: '2',
      name: '2' 
    });
    const map = arr.map(item => item.name);
    expect(map).toEqual(['1', '2']);
  });
});