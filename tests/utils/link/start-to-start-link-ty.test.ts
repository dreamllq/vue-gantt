import { calculateStartToStartLink } from '@/utils/link/start-to-start-link';
import { ArrowDirection, CalculateProps, LinkData, LinkPath } from '@/types/gantt-link';

describe('calculateStartToStartLink', () => {
  test('当 startLinkPoint.x > endLinkPoint.x 时，路径应包含向下段', () => {
    const props: CalculateProps = {
      sourceStartX: 300,
      sourceY: 50,
      targetStartX: 100,
      targetY: 150,
      layoutConfig: ({} as any),
      sourceFinishX: 0,
      targetFinishX: 0
    };

    const result: LinkData = calculateStartToStartLink(props);
    const expectedPath: LinkPath = [
      {
        x: 300,
        y: 50 
      }, // startPoint
      {
        x: 286,
        y: 50 
      }, // startLinkPoint (300 - 14)
      {
        x: 86,
        y: 50 
      }, // 中间点（x 对齐 endLinkPoint）
      {
        x: 86,
        y: 150 
      }, // endLinkPoint (100 - 14)
      {
        x: 100,
        y: 150 
      } // endPoint
    ];

    expect(result.path).toEqual(expectedPath);
    expect(result.arrow).toEqual({
      direction: ArrowDirection.RIGHT,
      point: {
        x: 100,
        y: 150 
      }
    });
  });

  test('当 startLinkPoint.x < endLinkPoint.x 时，路径应包含向右段', () => {
    const props: CalculateProps = {
      sourceStartX: 100,
      sourceY: 50,
      targetStartX: 300,
      targetY: 150,
      layoutConfig: ({} as any),
      sourceFinishX: 0,
      targetFinishX: 0
    };

    const result: LinkData = calculateStartToStartLink(props);
    const expectedPath: LinkPath = [
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
        y: 150 
      },
      {
        x: 286,
        y: 150 
      },
      {
        x: 300,
        y: 150 
      }
    ];

    expect(result.path).toEqual(expectedPath);
    expect(result.arrow).toEqual({
      direction: ArrowDirection.RIGHT,
      point: {
        x: 300,
        y: 150 
      }
    });
  });

  test('当 startLinkPoint.x == endLinkPoint.x 时，路径应直线连接', () => {
    const props: CalculateProps = {
      sourceStartX: 114, // 114 - 14 = 100
      sourceY: 50,
      targetStartX: 114, // 114 - 14 = 100
      targetY: 150,
      layoutConfig: ({} as any),
      sourceFinishX: 0,
      targetFinishX: 0
    };

    const result: LinkData = calculateStartToStartLink(props);
    const expectedPath: LinkPath = [
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
        y: 150 
      },
      {
        x: 114,
        y: 150 
      }
    ];

    expect(result.path).toEqual(expectedPath);
    expect(result.arrow).toEqual({
      direction: ArrowDirection.RIGHT,
      point: {
        x: 114,
        y: 150 
      }
    });
  });
});