export interface DisabledFunctions<T>{
  push(...items: T[]): number ;
  pop(): T | undefined ;
  shift(): T | undefined ;
  unshift(...items: T[]): number ;
  splice(start: number, deleteCount: number, ...items: T[]): T[] ;
}