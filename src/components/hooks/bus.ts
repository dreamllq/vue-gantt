
import { Id } from '@/types';
import { Events, EventsInterface } from '@/types/events';
import EventEmitter from '@/utils/eventemitter';
import { flatten, uniq } from 'lodash';
import asyncFragmentation from 'simple-async-fragmentation';

export const useBus = () => {
  const ee = new EventEmitter<EventsInterface | Events, any>();

  const bus = {
    emit: ee.emit.bind(ee),
    on: ee.on.bind(ee),
    off: ee.off.bind(ee)
  };

  bus.on(Events.BAR_CHANGE, asyncFragmentation<Id[]>(async (options:Id[][]) => {
    const ids = uniq(flatten(options));
    bus.emit(Events.BAR_CHANGE_FRAGMENTATION, ids);
    return [];
  }));

  return bus;
};