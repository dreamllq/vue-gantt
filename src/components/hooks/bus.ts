
import { Events } from '@/types/events';
import EventEmitter from '@/utils/eventemitter';

export const useBus = () => {
  const ee = new EventEmitter<Events, any>();

  return {
    emit: ee.emit.bind(ee),
    on: ee.on.bind(ee),
    off: ee.off.bind(ee)
  };
};