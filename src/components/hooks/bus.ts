
import { Events, EventsInterface } from '@/types/events';
import EventEmitter from '@/utils/eventemitter';

export const useBus = () => {
  const ee = new EventEmitter<EventsInterface, any>();

  const bus = {
    emit: ee.emit.bind(ee),
    on: ee.on.bind(ee),
    off: ee.off.bind(ee),
    once: ee.once.bind(ee)
  };
  return bus;
};