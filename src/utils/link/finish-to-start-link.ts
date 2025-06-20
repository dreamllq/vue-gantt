import { ArrowDirection, CalculateProps, LinkData, LinkPath } from '@/types/gantt-link';
export const calculateFinishToStartLink = (props: CalculateProps): LinkData => {
  const path:LinkPath = [];
  
  const startPoint = {
    x: props.sourceFinishX,
    y: props.sourceY
  };

  const endPoint = {
    x: props.targetStartX,
    y: props.targetY
  };

  const startLinkPoint = {
    x: startPoint.x + 20,
    y: startPoint.y 
  };
  const endLinkPoint = {
    x: endPoint.x - 20,
    y: endPoint.y
  };

  path.push(startPoint);
  if (startPoint.y !== endPoint.y || (Math.floor(startPoint.x * 1e10)) > (Math.floor(endPoint.x * 1e10))) {
    path.push(startLinkPoint);
    if (startLinkPoint.x < endLinkPoint.x) {
      path.push({
        x: startLinkPoint.x,
        y: endLinkPoint.y
      });
    } else if (startLinkPoint.x > endLinkPoint.x) {
      path.push({
        x: startLinkPoint.x,
        y: startLinkPoint.y > endLinkPoint.y ? startLinkPoint.y - Math.ceil(props.layoutConfig.ROW_HEIGHT / 2) : startLinkPoint.y + Math.floor(props.layoutConfig.ROW_HEIGHT / 2)
      });
      path.push({
        x: endLinkPoint.x,
        y: startLinkPoint.y > endLinkPoint.y ? startLinkPoint.y - Math.ceil(props.layoutConfig.ROW_HEIGHT / 2) : startLinkPoint.y + Math.floor(props.layoutConfig.ROW_HEIGHT / 2)
      });
    }

    if (path[path.length - 1].y !== endLinkPoint.y) {
      path.push(endLinkPoint);
    }
  }
  path.push(endPoint);

  const arrow = {
    direction: ArrowDirection.RIGHT,
    point: endPoint
  };

  return {
    path,
    arrow 
  };
};