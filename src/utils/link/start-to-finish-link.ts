import { ArrowDirection, CalculateProps, LinkData, LinkPath } from '@/types/gantt-link';
export const calculateStartToFinishLink = (props: CalculateProps): LinkData => {
  const path:LinkPath = [];
  
  const startPoint = {
    x: props.sourceStartX,
    y: props.sourceY
  };

  const endPoint = {
    x: props.targetFinishX,
    y: props.targetY
  };

  const startLinkPoint = {
    x: startPoint.x - 14,
    y: startPoint.y 
  };
  const endLinkPoint = {
    x: endPoint.x + 14,
    y: endPoint.y
  };

  path.push(startPoint);
  path.push(startLinkPoint);
  if (startLinkPoint.x < endLinkPoint.x) {

    path.push({
      x: startLinkPoint.x,
      y: startLinkPoint.y < endLinkPoint.y ? startLinkPoint.y + Math.floor(props.layoutConfig.ROW_HEIGHT / 2) : startLinkPoint.y - Math.ceil(props.layoutConfig.ROW_HEIGHT / 2)
    });

    path.push({
      x: endLinkPoint.x,
      y: startLinkPoint.y < endLinkPoint.y ? startLinkPoint.y + Math.floor(props.layoutConfig.ROW_HEIGHT / 2) : startLinkPoint.y - Math.ceil(props.layoutConfig.ROW_HEIGHT / 2)
    });
  } else if (startLinkPoint.x > endLinkPoint.x) {
      
    path.push({
      x: startLinkPoint.x,
      y: endLinkPoint.y
    });
  }
  path.push(endLinkPoint);
  path.push(endPoint);

  const arrow = {
    direction: ArrowDirection.LEFT,
    point: endPoint
  };

  return {
    path,
    arrow 
  };
};