export function dateWeek(date: Date): number {
  // 获取年份的第一天（1月1日）
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  // 计算从年初到指定日期的总天数差
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  // 计算年初到第一个周四的天数
  const firstThursdayOffset = (startOfYear.getDay() <= 4 ? 4 - startOfYear.getDay() : 11 - startOfYear.getDay());
  // 计算从年初到指定日期经过了几个完整的7天周期，再加上第一周的部分
  const weekNumber = Math.ceil((dayOfYear + firstThursdayOffset) / 7);

  return weekNumber;
}
