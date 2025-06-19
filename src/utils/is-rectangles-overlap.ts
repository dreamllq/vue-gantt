export const isRectanglesOverlap = (rect1:{x1:number, x2: number, y1: number, y2: number}, rect2:{x1:number, x2: number, y1: number, y2: number}) => {
  if (rect1.x2 <= rect2.x1 || rect2.x2 <= rect1.x1) {
    return false;
  }

  // 检查一个矩形是否完全在另一个矩形的上方或下方
  if (rect1.y2 <= rect2.y1 || rect2.y2 <= rect1.y1) {
    return false;
  }

  // 如果上述条件都不满足，则两个矩形重叠
  return true;
};