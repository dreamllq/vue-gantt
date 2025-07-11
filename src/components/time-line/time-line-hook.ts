import { onBeforeUnmount, onMounted, shallowRef } from 'vue';
import { useStore } from '../store';
import { computeDayList } from '@/utils/computeDayList';
import { ref } from 'vue';
import { ct } from '@/locales';
import { cloneDeep } from 'lodash';
import { Events } from '@/types/events';
import { strToDate } from '@/utils/to-date';
import { dateDiff } from '@/utils/date-diff';
import { Unit } from '@/types/unit';
import { dateFormat } from '@/utils/date-format';
import { dateWeek } from '@/utils/date-week';

export const useTimeLineHook = () => {
  const { bus, lazy, ganttEntity } = useStore()!;
  const { visibleAreaStartX, visibleAreaEndX, lazyReady } = lazy;
  
  const dayList = shallowRef<{
        formatString: any;
        seconds: number;
        date: Date;
        offsetSeconds: number
    }[]>([]);
  
  const lazyDayList = shallowRef<{
        formatString: any;
        seconds: number;
        date: Date;
        offsetSeconds: number
    }[]>([]);
  
  const WEEK = [
    'sun',
    'mon',
    'tue',
    'wed',
    'thu',
    'fri',
    'sat'
  ];
  const formatDate = (date:Date) => {
    if (ganttEntity.config.dataScaleUnit === 'day') {
      return dateFormat(date) + ' ' + ct(`weeks.${WEEK[date.getDay()]}`);
    } else if (ganttEntity.config.dataScaleUnit === 'week') {
      const formatStr = ct('weekFormat');
      const year = date.getFullYear();
      const week = dateWeek(date);
      return formatStr.replace('{year}', year.toString()).replace('{week}', week.toString());
    } else if (ganttEntity.config.dataScaleUnit === 'month') {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      return `${year}-${month}`;
    }
  };
  const calculate = () => {
    const dl = computeDayList(strToDate(ganttEntity.config.start), ganttEntity.config.dataUnitCount, ganttEntity.config.dataScaleUnit);
    const a = dl.map(item => ({
      ...item,
      formatString: formatDate(item.date),
      offsetSeconds: dateDiff(item.date, strToDate(ganttEntity.config.start), Unit.SECOND)
    }));
    dayList.value = a;
  };
  
  const lazyCalculate = () => {
    lazyDayList.value = cloneDeep(dayList.value).filter(item => item.offsetSeconds * ganttEntity.config.secondWidth >= visibleAreaStartX.value && item.offsetSeconds * ganttEntity.config.secondWidth <= visibleAreaEndX.value);
  };

  calculate();
  if (lazyReady.value) {
    lazyCalculate();
  }

  const onVisibleAreaChange = () => {
    lazyCalculate();
  };

  onMounted(() => {
    bus.on(Events.VISIBLE_AREA_CHANGE, onVisibleAreaChange);
  });

  onBeforeUnmount(() => {
    bus.off(Events.VISIBLE_AREA_CHANGE, onVisibleAreaChange);
  });

  return { lazyDayList };
};