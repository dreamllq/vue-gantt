export function getDatesBetween(startStr: string, endStr: string): string[] {
  // 将字符串转成 Date 对象
  const startDate = parseDateTimeString(startStr);
  const endDate = parseDateTimeString(endStr);

  if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error('Invalid date format');
  }

  const dates: string[] = [];

  // 只保留日期部分（本地时区）
  const currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const finalDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

  while (currentDate <= finalDate) {
    dates.push(formatDate(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

// 辅助函数：解析 YYYY-MM-DD HH:mm:ss 格式
function parseDateTimeString(str: string): Date | null {
  const match = str.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
  if (!match) return null;

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1; // 月份从 0 开始
  const day = parseInt(match[3], 10);
  const hour = parseInt(match[4], 10);
  const minute = parseInt(match[5], 10);
  const second = parseInt(match[6], 10);

  return new Date(year, month, day, hour, minute, second);
}

// 辅助函数：格式化日期为 YYYY-MM-DD
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}