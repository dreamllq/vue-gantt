
import EventEmitter from 'eventemitter3';

export const useBus = () => {
  const ee = new EventEmitter();

  return {
    emit: ee.emit.bind(ee),
    on: ee.on.bind(ee),
    off: ee.off.bind(ee)
  };
};