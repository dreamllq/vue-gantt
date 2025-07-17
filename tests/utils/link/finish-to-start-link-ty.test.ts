import { calculateFinishToStartLink } from '@/utils/link/finish-to-start-link';
import { ArrowDirection, CalculateProps } from '@/types/gantt-link';
import { GanttLayoutConfig } from '@/models/gantt-layout-config';

describe('calculateFinishToStartLink', () => {
  const layoutConfig = { ROW_HEIGHT: 40 } as GanttLayoutConfig;

  const createProps = (
    sourceFinishX: number,
    sourceY: number,
    targetStartX: number,
    targetY: number
  ): CalculateProps => ({
    sourceFinishX,
    sourceY,
    targetStartX,
    targetY,
    layoutConfig,
    sourceStartX: 0,
    targetFinishX: 0
  });

  test('同一行，起点在终点左侧', () => {
    const props = createProps(100, 50, 200, 50);
    const result = calculateFinishToStartLink(props);

    expect(result.path).toEqual([
      {
        x: 100,
        y: 50 
      },
      {
        x: 200,
        y: 50 
      }
    ]);
    expect(result.arrow.direction).toBe(ArrowDirection.RIGHT);
    expect(result.arrow.point).toEqual({
      x: 200,
      y: 50 
    });
  });

  test('不同行，起点在终点左侧', () => {
    const props = createProps(100, 50, 200, 100);
    const result = calculateFinishToStartLink(props);

    expect(result.path).toEqual([
      {
        x: 100,
        y: 50 
      },
      {
        x: 120,
        y: 50 
      },
      {
        x: 120,
        y: 100 
      },
      {
        x: 200,
        y: 100 
      }
    ]);
    expect(result.arrow.direction).toBe(ArrowDirection.RIGHT);
    expect(result.arrow.point).toEqual({
      x: 200,
      y: 100 
    });
  });

  test('不同行，起点在终点右侧', () => {
    const props = createProps(300, 50, 100, 100);
    const result = calculateFinishToStartLink(props);

    expect(result.path).toEqual([
      {
        x: 300,
        y: 50 
      },
      {
        x: 320,
        y: 50 
      },
      {
        x: 320,
        y: 70 
      },
      {
        x: 80,
        y: 70 
      },
      {
        x: 80,
        y: 100 
      },
      {
        x: 100,
        y: 100 
      }
    ]);
    expect(result.arrow.direction).toBe(ArrowDirection.RIGHT);
    expect(result.arrow.point).toEqual({
      x: 100,
      y: 100 
    });
  });

  test('不同行，起点等于终点', () => {
    const props = createProps(200, 50, 200, 100);
    const result = calculateFinishToStartLink(props);

    expect(result.path).toEqual([
      {
        x: 200,
        y: 50 
      },
      {
        x: 220,
        y: 50 
      },
      {
        x: 220,
        y: 70 
      },
      {
        x: 180,
        y: 70 
      },
      {
        x: 180,
        y: 100 
      },
      {
        x: 200,
        y: 100 
      }
    ]);
    expect(result.arrow.direction).toBe(ArrowDirection.RIGHT);
    expect(result.arrow.point).toEqual({
      x: 200,
      y: 100 
    });
  });

  test('不同行，起点在终点右侧且终点Y小于起点Y', () => {
    const props = createProps(300, 100, 100, 50);
    const result = calculateFinishToStartLink(props);

    expect(result.path).toEqual([
      {
        x: 300,
        y: 100 
      },
      {
        x: 320,
        y: 100 
      },
      {
        x: 320,
        y: 80 
      },
      {
        x: 80,
        y: 80 
      },
      {
        x: 80,
        y: 50 
      },
      {
        x: 100,
        y: 50 
      }
    ]);
    expect(result.arrow.direction).toBe(ArrowDirection.RIGHT);
    expect(result.arrow.point).toEqual({
      x: 100,
      y: 50 
    });
  });

  test('不同行，路径需要添加 endLinkPoint', () => {
    const props = createProps(300, 50, 100, 100);
    const result = calculateFinishToStartLink(props);

    expect(result.path).toEqual([
      {
        x: 300,
        y: 50 
      },
      {
        x: 320,
        y: 50 
      },
      {
        x: 320,
        y: 70 
      },
      {
        x: 80,
        y: 70 
      },
      {
        x: 80,
        y: 100 
      },
      {
        x: 100,
        y: 100 
      }
    ]);
    expect(result.arrow.direction).toBe(ArrowDirection.RIGHT);
    expect(result.arrow.point).toEqual({
      x: 100,
      y: 100 
    });
  });
});