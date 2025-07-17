import { calculateFinishToFinishLink } from '@/utils/link/finish-to-finish-link';
import { ArrowDirection, CalculateProps, LinkData, LinkPath } from '@/types/gantt-link';

describe('calculateFinishToFinishLink', () => {
  it('should handle startLinkPoint.x > endLinkPoint.x', () => {
    const props: CalculateProps = {
      sourceFinishX: 100,
      sourceY: 50,
      targetFinishX: 80,
      targetY: 60,
      sourceStartX: 0,
      targetStartX: 0,
      layoutConfig: ({} as any)
    };

    const result = calculateFinishToFinishLink(props);

    const expectedPath: LinkPath = [
      {
        x: 100,
        y: 50 
      },
      {
        x: 114,
        y: 50 
      },
      {
        x: 114,
        y: 60 
      },
      {
        x: 94,
        y: 60 
      },
      {
        x: 80,
        y: 60 
      }
    ];

    const expectedArrow = {
      direction: ArrowDirection.LEFT,
      point: {
        x: 80,
        y: 60 
      }
    };

    expect(result).toEqual<Partial<LinkData>>({
      path: expectedPath,
      arrow: expectedArrow
    });
  });

  it('should handle startLinkPoint.x < endLinkPoint.x', () => {
    const props: CalculateProps = {
      sourceFinishX: 100,
      sourceY: 50,
      targetFinishX: 120,
      targetY: 60,
      sourceStartX: 0,
      targetStartX: 0,
      layoutConfig: ({} as any)
    };

    const result = calculateFinishToFinishLink(props);

    const expectedPath: LinkPath = [
      {
        x: 100,
        y: 50 
      },
      {
        x: 114,
        y: 50 
      },
      {
        x: 134,
        y: 50 
      },
      {
        x: 134,
        y: 60 
      },
      {
        x: 120,
        y: 60 
      }
    ];

    const expectedArrow = {
      direction: ArrowDirection.LEFT,
      point: {
        x: 120,
        y: 60 
      }
    };

    expect(result).toEqual<Partial<LinkData>>({
      path: expectedPath,
      arrow: expectedArrow
    });
  });

  it('should handle startLinkPoint.x === endLinkPoint.x', () => {
    const props: CalculateProps = {
      sourceFinishX: 100,
      sourceY: 50,
      targetFinishX: 100,
      targetY: 60,
      sourceStartX: 0,
      targetStartX: 0,
      layoutConfig: ({} as any)
    };

    const result = calculateFinishToFinishLink(props);

    const expectedPath: LinkPath = [
      {
        x: 100,
        y: 50 
      },
      {
        x: 114,
        y: 50 
      },
      {
        x: 114,
        y: 60 
      },
      {
        x: 100,
        y: 60 
      }
    ];

    const expectedArrow = {
      direction: ArrowDirection.LEFT,
      point: {
        x: 100,
        y: 60 
      }
    };

    expect(result).toEqual<Partial<LinkData>>({
      path: expectedPath,
      arrow: expectedArrow
    });
  });
});