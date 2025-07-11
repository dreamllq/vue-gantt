import { TimeRange } from '@/types/utils';
import { clone, cloneDeep, max, min } from 'lodash';
import { strToDate } from './to-date';
import { dateTimeFormat } from './date-time-format';

export default (...args: TimeRange[][]) => {
  let result: TimeRange[] = cloneDeep(args[0] || []);
  let temp: TimeRange[];
  
  for (let i = 1; i < args.length; i++) {
    temp = [];
    (args[i] || []).forEach(sourceTimeRange => {
      result.forEach(targetTimeRange => {
        const wt = intersectionWorkTime(sourceTimeRange, targetTimeRange);
        if (wt) {
          temp.push(wt);
        }
      });
    });
    result = cloneDeep(temp);
  }

  return result;
};


export const intersectionWorkTime = (sourceTimeRange:TimeRange, targetTimeRange:TimeRange):{
    start: string;
    end: string;
} | null => {
  const sourceStartDate = strToDate(sourceTimeRange.start);
  const sourceEndDate = strToDate(sourceTimeRange.end);
  const targetStartDate = strToDate(targetTimeRange.start);
  const targetEndDate = strToDate(targetTimeRange.end);

  const start = max([sourceStartDate.getTime(), targetStartDate.getTime()])!;
  const end = min([sourceEndDate.getTime(), targetEndDate.getTime()])!;

  if (start < end) {
    return {
      start: dateTimeFormat(new Date(start)),
      end: dateTimeFormat(new Date(end))
    };
  } else {
    return null;
  }
};