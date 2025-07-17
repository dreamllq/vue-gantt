import { GanttBus } from '@/models/gantt-bus';
import { GanttConfig } from '@/models/gantt-config';
import { GanttContainer } from '@/models/gantt-container';
import { GanttGroups } from '@/models/gantt-groups';
import { GanttLayoutConfig } from '@/models/gantt-layout-config';
import { GanttScroll } from '@/models/gantt-scroll';
import { GanttScrollClassConstructor } from '@/types/gantt-scroll';

const bus = new GanttBus();
// 模拟依赖类
class MockGanttGroups extends GanttGroups {
  getGroupHeight = jest.fn();
  bus = bus;
}

class MockGanttContainer extends GanttContainer {
  width = 800;
  height = 600;
}

describe('GanttScroll', () => {
  let ganttScroll: GanttScroll;
  let mockGroups: MockGanttGroups;
  let mockContainer: MockGanttContainer;

  const layoutConfig = new GanttLayoutConfig({
    HEADER_HEIGHT: 50,
    GRID_CELL_WIDTH: 100,
    SCROLL_WIDTH: 10,
    SCROLL_HEIGHT: 10
  });

  const config = {
    totalSeconds: 3600,
    secondWidth: 1
  } as GanttConfig;

  beforeEach(() => {
    mockGroups = new MockGanttGroups({ bus } as any);
    mockContainer = new MockGanttContainer();

    const data: GanttScrollClassConstructor = {
      groups: mockGroups,
      container: mockContainer,
      config,
      layoutConfig
    };

    ganttScroll = new GanttScroll(data);
  });

  describe('calculateHasScroll', () => {
    it('should correctly determine if horizontal and vertical scroll are needed', () => {
      (mockGroups.getGroupHeight as jest.Mock).mockReturnValue(540);
      const scheduleWidth = config.totalSeconds * config.secondWidth; // 3600px

      // Container width after subtracting grid cell width is 700px (800 - 100)
      // Container height after subtracting header height is 550px (600 - 50)
      // Data height is 550, which equals the available height, so no vertical scroll needed.
      // Schedule width is 3600 > 700, so horizontal scroll is needed.

      const result = ganttScroll.calculateHasScroll();

      expect(result.x).toBe(true); // Horizontal scroll should be needed
      expect(result.y).toBe(false); // Vertical scroll should not be needed
    });

    it('should handle case when both scrolls are needed due to overflow', () => {
      (mockGroups.getGroupHeight as jest.Mock).mockReturnValue(600);
      const scheduleWidth = config.totalSeconds * config.secondWidth + layoutConfig.SCROLL_HEIGHT; // 3600 + 10 = 3610

      const result = ganttScroll.calculateHasScroll();

      expect(result.x).toBe(true); // Horizontal scroll should be needed
      expect(result.y).toBe(true); // Vertical scroll should be needed
    });

    it('should enable horizontal scroll when vertical scroll exists and schedule width plus scroll height exceeds available width', () => {
      // Data height is greater than available height (container height - header)
      (mockGroups.getGroupHeight as jest.Mock).mockReturnValue(600); // isOverHeight = true

      // Schedule width is less than available width (800 - 100 = 700), but after adding scroll height, it exceeds
      const scheduleWidth = 690;
      (ganttScroll.config as any).totalSeconds = scheduleWidth; // totalSeconds = 690
      (ganttScroll.config as any).secondWidth = 1;

      const result = ganttScroll.calculateHasScroll();

      expect(result.x).toBe(false); // Horizontal scroll should be needed due to scroll bar
      expect(result.y).toBe(true); // Vertical scroll is needed
    });
  });

  describe('getters', () => {
    it('should return correct xScrollWidth when vertical scroll exists', () => {
      ganttScroll.hasY = true;

      const expectedWidth = mockContainer.width - layoutConfig.SCROLL_WIDTH;
      expect(ganttScroll.xScrollWidth).toBe(expectedWidth);
    });

    it('should return correct xScrollBarWidth', () => {
      const expectedWidth = config.totalSeconds * config.secondWidth + layoutConfig.GRID_CELL_WIDTH;
      expect(ganttScroll.xScrollBarWidth).toBe(expectedWidth);
    });

    it('should return correct yScrollHeight when horizontal scroll exists', () => {
      ganttScroll.hasX = true;

      const expectedHeight =
        mockContainer.height - layoutConfig.HEADER_HEIGHT - layoutConfig.SCROLL_HEIGHT;
      expect(ganttScroll.yScrollHeight).toBe(expectedHeight);
    });

    it('should return correct yScrollBarHeight', () => {
      (mockGroups.getGroupHeight as jest.Mock).mockReturnValue(1000);
      expect(ganttScroll.yScrollBarHeight).toBe(1000);
    });
  });



  describe('calculate', () => {
    it('should update hasX and hasY based on calculateHasScroll result', () => {
    // 模拟 calculateHasScroll 返回值
      jest.spyOn(ganttScroll, 'calculateHasScroll').mockReturnValue({
        x: true,
        y: false 
      });

      ganttScroll.calculate();

      expect(ganttScroll.hasX).toBe(true);
      expect(ganttScroll.hasY).toBe(false);
    });

    it('should call calculateHasScroll internally', () => {
      const spy = jest.spyOn(ganttScroll, 'calculateHasScroll');

      ganttScroll.calculate();

      expect(spy).toHaveBeenCalled();
    });
  });
});