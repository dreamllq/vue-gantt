import { GanttLinkType } from '@/types/gantt-link';
import { GanttBars } from '@/models/gantt-bars';
import { GanttLinkView, calculateFunction } from '@/models/gantt-link-view';
import { calculateFinishToStartLink } from '@/utils/link/finish-to-start-link';

describe('GanttLinkView', () => {
  let barsMock: GanttBars;

  beforeEach(() => {
    barsMock = { getById: jest.fn() } as any;
  });

  const mockBar = (id: string, sx: number, ex: number, sy: number, height: number) => ({
    id,
    sx,
    ex,
    sy,
    height, // ✅ 确保这个字段存在
    selected: false,
    color: '#000'
  });

  it('should create instance with correct properties', () => {
    const data = {
      id: '1',
      source: { id: 's1' },
      target: { id: 't1' },
      linkType: GanttLinkType.FINISH_TO_START,
      layoutConfig: {} as any,
      bars: barsMock
    };

    const link = new GanttLinkView(data as any);
    expect(link.id).toBe('1');
    expect(link.source.id).toEqual('s1');
    expect(link.target.id).toEqual('t1');
    expect(link.linkType).toBe(GanttLinkType.FINISH_TO_START);
    expect(link.isShow).toBe(true);
    expect(link.zIndex).toBe(1);
  });

  describe('property accessors', () => {
    let link: GanttLinkView;

    beforeEach(() => {
      const data = {
        id: '1',
        source: { id: 's1' },
        target: { id: 't1' },
        linkType: GanttLinkType.FINISH_TO_START,
        layoutConfig: {} as any,
        bars: barsMock
      };
      link = new GanttLinkView(data as any);
    });

    it('should get sourceBar and targetBar correctly', () => {
      const sourceBar = mockBar('s1', 100, 200, 50, 30);
      const targetBar = mockBar('t1', 300, 400, 100, 30);

      (barsMock.getById as jest.Mock)
        .mockReturnValueOnce(sourceBar)
        .mockReturnValueOnce(targetBar);

      expect(link.sourceBar).toBe(sourceBar);
      expect(link.targetBar).toBe(targetBar);
    });

    it('should get sourceY and targetY correctly', () => {
      const sourceBar = mockBar('s1', 100, 200, 50, 30); // height=30
      const targetBar = mockBar('t1', 300, 400, 100, 40); // height=40

      (barsMock.getById as jest.Mock)
        .mockReturnValueOnce(sourceBar)
        .mockReturnValueOnce(targetBar);

      expect(link.sourceY).toBe(50 + Math.floor(30 / 2) - 0.5);
      expect(link.targetY).toBe(100 + Math.floor(40 / 2) - 0.5);
    });

    it('should return undefined when sourceBar is not found', () => {
      (barsMock.getById as jest.Mock).mockReturnValue(undefined);
      expect(link.sourceY).toBeUndefined();
    });

    it('should get sourceStartX and sourceFinishX correctly', () => {
      const sourceBar = mockBar('s1', 100, 200, 50, 30);
      (barsMock.getById as jest.Mock).mockReturnValue(sourceBar);

      expect(link.sourceStartX).toBe(100);
      expect(link.sourceFinishX).toBe(200);
    });

    it('should get targetStartX and targetFinishX correctly', () => {
      const targetBar = mockBar('t1', 300, 400, 100, 30);
      (barsMock.getById as jest.Mock).mockReturnValue(targetBar);

      expect(link.targetStartX).toBe(300);
      expect(link.targetFinishX).toBe(400);
    });
  });

  describe('calculate()', () => {
    let link: GanttLinkView;
    const mockCalculateFunction = jest.fn().mockReturnValue({
      path: [
        {
          x: 10,
          y: 20 
        },
        {
          x: 30,
          y: 40 
        }
      ],
      arrow: {
        x: 30,
        y: 40 
      }
    });

    beforeEach(() => {
    // 替换模块函数
      jest.spyOn(calculateFunction, GanttLinkType.FINISH_TO_START).mockImplementation(mockCalculateFunction);

      const data = {
        id: '1',
        source: { id: 's1' },
        target: { id: 't1' },
        linkType: GanttLinkType.FINISH_TO_START,
        layoutConfig: {} as any,
        bars: barsMock
      };
      link = new GanttLinkView(data as any);

      // ✅ 强制替换类中的映射关系
      // (link as any).calculateFunction = { [GanttLinkType.FINISH_TO_START]: mockCalculateFunction };
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should calculate path and arrow correctly', () => {
      const sourceBar = mockBar('s1', 100, 200, 50, 30);
      const targetBar = mockBar('t1', 300, 400, 100, 30);

      (barsMock.getById as jest.Mock)
        .mockReturnValueOnce(sourceBar)
        .mockReturnValueOnce(targetBar);

      link.calculate();

      // expect(mockCalculateFunction).toHaveBeenCalledWith({
      //   layoutConfig: {},
      //   sourceFinishX: 200,
      //   sourceStartX: 100,
      //   sourceY: 64.5,
      //   targetFinishX: 400,
      //   targetStartX: 300,
      //   targetY: 114.5
      // });

      expect(link.path).toEqual([
        {
          x: 10,
          y: 20 
        },
        {
          x: 30,
          y: 40 
        }
      ]);
      expect(link.arrow).toEqual({
        x: 30,
        y: 40 
      });
    });
  });

  describe('toUiJSON()', () => {
    it('should return correct UI JSON', () => {
      const data = {
        id: '1',
        source: { id: 's1' },
        target: { id: 't1' },
        linkType: GanttLinkType.FINISH_TO_START,
        layoutConfig: {} as any,
        bars: barsMock
      };
      const link = new GanttLinkView(data as any);
      link.path = [
        {
          x: 10,
          y: 20 
        },
        {
          x: 30,
          y: 40 
        }
      ];
      link.sx = 10;
      link.sy = 20;
      link.ex = 30;
      link.ey = 40;
      link.zIndex = 2;

      const sourceBar = mockBar('s1', 100, 200, 50, 30);
      const targetBar = mockBar('t1', 300, 400, 100, 30);
      sourceBar.selected = true;

      (barsMock.getById as jest.Mock)
        .mockReturnValueOnce(sourceBar)
        .mockReturnValueOnce(targetBar);

      const result = link.toUiJSON();

      expect(result).toEqual({
        id: '1',
        path: [
          {
            x: 10,
            y: 20 
          },
          {
            x: 30,
            y: 40 
          }
        ],
        sourceId: 's1',
        targetId: 't1',
        sx: 10,
        sy: 20,
        ex: 30,
        ey: 40,
        zIndex: 2,
        selected: true,
        color: '#000'
      });
    });
  });

  describe('toJSON()', () => {
    it('should return correct JSON', () => {
      const data = {
        id: '1',
        source: { id: 's1' },
        target: { id: 't1' },
        linkType: GanttLinkType.FINISH_TO_START,
        layoutConfig: {} as any,
        bars: barsMock
      };
      const link = new GanttLinkView(data as any);
      const json = link.toJSON();

      expect(json).toEqual({
        id: '1',
        sourceId: 's1',
        targetId: 't1',
        linkType: GanttLinkType.FINISH_TO_START
      });
    });
  });
});