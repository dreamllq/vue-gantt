import { calculateStartToFinishLink } from '@/utils/link/start-to-finish-link';
import { CalculateProps, ArrowDirection } from '@/types/gantt-link';
import { GanttLayoutConfig } from '@/models/gantt-layout-config';

describe('calculateStartToFinishLink', () => {
  const layoutConfig = { ROW_HEIGHT: 40 } as GanttLayoutConfig;

  it('should handle startLinkPoint.x < endLinkPoint.x and startLinkPoint.y < endLinkPoint.y', () => {
    const props: CalculateProps = {
      sourceStartX: 100,
      sourceY: 50,
      targetFinishX: 200,
      targetY: 70,
      layoutConfig,
      sourceFinishX: 0,
      targetStartX: 0
    };

    const result = calculateStartToFinishLink(props);

    expect(result.path).toEqual([
      {
        x: 100,
        y: 50 
      },
      {
        x: 86,
        y: 50 
      },
      {
        x: 86,
        y: 70 
      },
      {
        x: 214,
        y: 70 
      },
      {
        x: 214,
        y: 70 
      },
      {
        x: 200,
        y: 70 
      }
    ]);
    expect(result.arrow).toEqual({
      direction: ArrowDirection.LEFT,
      point: {
        x: 200,
        y: 70 
      }
    });
  });

  it('should handle startLinkPoint.x < endLinkPoint.x and startLinkPoint.y >= endLinkPoint.y', () => {
    const props: CalculateProps = {
      sourceStartX: 100,
      sourceY: 100,
      targetFinishX: 200,
      targetY: 70,
      layoutConfig,
      sourceFinishX: 0,
      targetStartX: 0
    };

    const result = calculateStartToFinishLink(props);

    expect(result.path).toEqual([
      {
        x: 100,
        y: 100 
      },
      {
        x: 86,
        y: 100 
      },
      {
        x: 86,
        y: 80 
      },
      {
        x: 214,
        y: 80 
      },
      {
        x: 214,
        y: 70 
      },
      {
        x: 200,
        y: 70 
      }
    ]);
    expect(result.arrow).toEqual({
      direction: ArrowDirection.LEFT,
      point: {
        x: 200,
        y: 70 
      }
    });
  });

  it('should handle startLinkPoint.x > endLinkPoint.x', () => {
    const props: CalculateProps = {
      sourceStartX: 300,
      sourceY: 50,
      targetFinishX: 100,
      targetY: 70,
      layoutConfig,
      sourceFinishX: 0,
      targetStartX: 0
    };

    const result = calculateStartToFinishLink(props);

    expect(result.path).toEqual([
      {
        x: 300,
        y: 50 
      },
      {
        x: 286,
        y: 50 
      },
      {
        x: 286,
        y: 70 
      },
      {
        x: 114,
        y: 70 
      },
      {
        x: 100,
        y: 70 
      }
    ]);
    expect(result.arrow).toEqual({
      direction: ArrowDirection.LEFT,
      point: {
        x: 100,
        y: 70 
      }
    });
  });

  it('should handle startLinkPoint.x === endLinkPoint.x', () => {
    const props: CalculateProps = {
      sourceStartX: 114,
      sourceY: 50,
      targetFinishX: 100,
      targetY: 70,
      layoutConfig,
      sourceFinishX: 0,
      targetStartX: 0
    };

    const result = calculateStartToFinishLink(props);

    expect(result.path).toEqual([
      {
        x: 114,
        y: 50 
      },
      {
        x: 100,
        y: 50 
      },
      {
        x: 100,
        y: 70 
      },
      {
        x: 114,
        y: 70
      },
      {
        x: 114,
        y: 70
      },
      {
        x: 100,
        y: 70 
      }
    ]);
    expect(result.arrow).toEqual({
      direction: ArrowDirection.LEFT,
      point: {
        x: 100,
        y: 70 
      }
    });
  });
});