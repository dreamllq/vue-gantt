import { Moment } from 'moment';
import { computeDayScale } from './computeDayScale';

export const computeScaleList = ({ dataScaleUnit, date, step, thWidth, secondWidth }) => {
  const list:{
    scale: number,
    left: number,
    date: Moment
  }[] = [];
  // 判断 日 周 月
  if (dataScaleUnit === 'day') {
    const dayScales = computeDayScale(date);
    const stepNum = step;
    // const { hour, minute } = daySplitTime;
    const stepWidth = thWidth / (24 / stepNum);
    const stepCount = 24 / stepNum;
    for (let i = 0; i < stepCount; i++) {
      const index = i * stepNum;
      const item = dayScales[index];
      list.push({
        scale: item.hour,
        left: item.leftSeconds * secondWidth,
        date: item.date
      });
    }
    return list;
  } else if (dataScaleUnit === 'week') {
    const stepNum = step;
    // const { hour, minute } = daySplitTime;
    const day = 1; // 周第几天
    const stepWidth = thWidth / (7 / stepNum);
    const stepCount = 7 / stepNum;
    for (let i = 0; i < stepCount; i++) {
      list.push({
        date: date.clone().add(i * stepNum, 'day'),
        scale: day + i,
        left: i * stepWidth 
      });
    }
    return list;
  } else if (dataScaleUnit === 'month') {
    const stepNum = step;
    // const { hour, minute } = daySplitTime;
    const day = 1; // 月第几天
    const stepWidth = thWidth / (30 / stepNum);
    const stepCount = 30 / stepNum;
    for (let i = 0; i < stepCount; i++) {
      list.push({
        scale: (day + i * stepNum) % 30,
        left: i * stepWidth,
        date: date.clone().add(i * stepNum, 'day')
      });
    }
    return list;
  }
  return list;
};