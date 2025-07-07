export function getDatesBetween(startDate: Date, endDate: Date): string[] {
  const dates: string[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    // 格式化为 YYYY-MM-DD
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 月份从0开始
    const day = String(currentDate.getDate()).padStart(2, '0');

    dates.push(`${year}-${month}-${day}`);

    // 移动到下一天
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}