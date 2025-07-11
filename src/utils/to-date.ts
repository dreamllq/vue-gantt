export const strToDate = (str: string) => new Date(str.replace(' ', 'T'));

// 辅助函数：解析 YYYY-MM-DD HH:mm:ss 格式
// function parseDateTimeString(str: string): Date | null {
//   const match = str.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
//   if (!match) return null;

//   const year = parseInt(match[1], 10);
//   const month = parseInt(match[2], 10) - 1; // 月份从 0 开始
//   const day = parseInt(match[3], 10);
//   const hour = parseInt(match[4], 10);
//   const minute = parseInt(match[5], 10);
//   const second = parseInt(match[6], 10);

//   return new Date(year, month, day, hour, minute, second);
// }