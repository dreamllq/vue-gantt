import { onBeforeUnmount, onMounted } from 'vue';
import { useStore } from '../store';
import { computeDayList } from '@/utils/computeDayList';
import { ref } from 'vue';
import { ct } from '@/locales';
import { cloneDeep } from 'lodash';

export const useTimeLineHook = () => {
  const { bus, lazy, ganttEntity } = useStore()!;
  const { visibleAreaStartX, visibleAreaEndX, lazyReady } = lazy;
  
  const dayList = ref<{
        formatString: any;
        seconds: number;
        date: moment.Moment;
        offsetSeconds: number
    }[]>([]);
  
  const lazyDayList = ref<{
        formatString: any;
        seconds: number;
        date: moment.Moment;
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
  const formatDate = (date) => {
    if (ganttEntity.config.dataScaleUnit === 'day') {
      const formatStr = 'YYYY-MM-DD';
      return date.format(formatStr) + ' ' + ct(`weeks.${WEEK[date.day()]}`);
    } else if (ganttEntity.config.dataScaleUnit === 'week') {
      const formatStr = ct('weekFormat');
      return date.clone().endOf('w').format(formatStr);
    } else if (ganttEntity.config.dataScaleUnit === 'month') {
      const formatStr = 'YYYY-MM';
      return date.format(formatStr);
    }
  };
  const calculate = () => {
    const dl = computeDayList(ganttEntity.config.startDate, ganttEntity.config.dataUnitCount, ganttEntity.config.dataScaleUnit);
    const a = dl.map(item => ({
      ...item,
      formatString: formatDate(item.date),
      offsetSeconds: item.date.diff(ganttEntity.config.startDate, 'second')
    }));
      // console.log('a', a);
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
    bus.on('visible-area-change', onVisibleAreaChange);
  });

  onBeforeUnmount(() => {
    bus.off('visible-area-change', onVisibleAreaChange);
  });

  return { lazyDayList };
};