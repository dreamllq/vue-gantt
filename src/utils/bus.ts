import EventEmitter from 'eventemitter3';
const ee = new EventEmitter();

export default {
  emit: ee.emit.bind(ee),
  on: ee.on.bind(ee),
  off: ee.off.bind(ee)
};