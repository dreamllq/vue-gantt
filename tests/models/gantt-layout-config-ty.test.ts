import { GanttLayoutConfig } from '@/models/gantt-layout-config';

describe('GanttLayoutConfig', () => {
  let config: GanttLayoutConfig;

  const mockData = {
    sizeRatioPercent: 120,
    HEADER_HEIGHT: 80,
    ROW_HEIGHT: 90,
    TIME_UNIT_WIDTH: 250,
    SCROLL_WIDTH: 15,
    SCROLL_HEIGHT: 15,
    GRID_HEAD_CELL_WIDTH: 160,
    BAR_HEIGHT: 40,
    GRID_CELL_WIDTH: 500,
    MILESTONE_WIDTH: 25,
    ATTACHED_BAR_HEIGHT: 25,
    ATTACHED_ROW_HEIGHT: 35,
    AUTO_SCROLL_AREA_SIZE: 60,
    AUTO_SCROLL_INTERVAL_MS: 10,
    AUTO_SCROLL_SHIFT_AMOUNT_X: 5,
    AUTO_SCROLL_SHIFT_AMOUNT_Y: 5
  };

  beforeEach(() => {
    config = new GanttLayoutConfig(mockData);
  });

  test('should initialize with provided data or defaults', () => {
    expect(config.HEADER_HEIGHT).toBe(80 * 120 / 100);
    expect(config.ROW_HEIGHT).toBe(90 * 120 / 100);
    expect(config.TIME_UNIT_WIDTH).toBe(250 * 120 / 100);
    expect(config.SCROLL_WIDTH).toBe(15);
    expect(config.SCROLL_HEIGHT).toBe(15);
    expect(config.GRID_HEAD_CELL_WIDTH).toBe(160 * 120 / 100);
    expect(config.BAR_HEIGHT).toBe(40 * 120 / 100);
    expect(config.GRID_CELL_WIDTH).toBe(500 * 120 / 100);
    expect(config.MILESTONE_WIDTH).toBe(25 * 120 / 100);
    expect(config.ATTACHED_BAR_HEIGHT).toBe(25 * 120 / 100);
    expect(config.ATTACHED_ROW_HEIGHT).toBe(35 * 120 / 100);
    expect(config.AUTO_SCROLL_AREA_SIZE).toBe(60);
    expect(config.AUTO_SCROLL_INTERVAL_MS).toBe(10);
    expect(config.AUTO_SCROLL_SHIFT_AMOUNT_X).toBe(5);
    expect(config.AUTO_SCROLL_SHIFT_AMOUNT_Y).toBe(5);
  });

  test('sizeRatioPercent should trigger event when changed', () => {
    const handler = jest.fn();
    config.on(GanttLayoutConfig.Events.SIZE_RATIO_PERCENT_CHANGE, handler);

    config.sizeRatioPercent = 150;
    expect(config.sizeRatioPercent).toBe(150);
    expect(handler).toHaveBeenCalledWith(150);
  });

  test('setting a property should not affect the original value until sizeRatioPercent changes', () => {
    config.HEADER_HEIGHT = 100;
    expect(config.HEADER_HEIGHT).toBe(100 * 120 / 100); // still using old ratio
    config.sizeRatioPercent = 150;
    expect(config.HEADER_HEIGHT).toBe(100 * 150 / 100); // now uses new ratio
  });

  test('toJSON should return correct raw values', () => {
    const json = config.toJSON();
    expect(json.HEADER_HEIGHT).toBe(80);
    expect(json.ROW_HEIGHT).toBe(90);
    expect(json.TIME_UNIT_WIDTH).toBe(250);
    expect(json.sizeRatioPercent).toBe(120);
    expect(json.BAR_HEIGHT).toBe(40);
    expect(json.ATTACHED_ROW_HEIGHT).toBe(35);
  });
  test('GRID_HEAD_CELL_WIDTH should apply sizeRatioPercent', () => {
    expect(config.GRID_HEAD_CELL_WIDTH).toBe(160 * 120 / 100);
    config.GRID_HEAD_CELL_WIDTH = 180;
    expect(config.GRID_HEAD_CELL_WIDTH).toBe(180 * 120 / 100); // still uses old ratio
    config.sizeRatioPercent = 150;
    expect(config.GRID_HEAD_CELL_WIDTH).toBe(180 * 150 / 100); // now uses new ratio
  });

  test('BAR_HEIGHT should apply sizeRatioPercent', () => {
    expect(config.BAR_HEIGHT).toBe(40 * 120 / 100);
    config.BAR_HEIGHT = 50;
    expect(config.BAR_HEIGHT).toBe(50 * 120 / 100);
    config.sizeRatioPercent = 150;
    expect(config.BAR_HEIGHT).toBe(50 * 150 / 100);
  });

  test('GRID_CELL_WIDTH should apply sizeRatioPercent', () => {
    expect(config.GRID_CELL_WIDTH).toBe(500 * 120 / 100);
    config.GRID_CELL_WIDTH = 600;
    expect(config.GRID_CELL_WIDTH).toBe(600 * 120 / 100);
    config.sizeRatioPercent = 150;
    expect(config.GRID_CELL_WIDTH).toBe(600 * 150 / 100);
  });

  test('MILESTONE_WIDTH should apply sizeRatioPercent', () => {
    expect(config.MILESTONE_WIDTH).toBe(25 * 120 / 100);
    config.MILESTONE_WIDTH = 30;
    expect(config.MILESTONE_WIDTH).toBe(30 * 120 / 100);
    config.sizeRatioPercent = 150;
    expect(config.MILESTONE_WIDTH).toBe(30 * 150 / 100);
  });

  test('ATTACHED_BAR_HEIGHT should apply sizeRatioPercent', () => {
    expect(config.ATTACHED_BAR_HEIGHT).toBe(25 * 120 / 100);
    config.ATTACHED_BAR_HEIGHT = 30;
    expect(config.ATTACHED_BAR_HEIGHT).toBe(30 * 120 / 100);
    config.sizeRatioPercent = 150;
    expect(config.ATTACHED_BAR_HEIGHT).toBe(30 * 150 / 100);
  });

  test('ATTACHED_ROW_HEIGHT should apply sizeRatioPercent', () => {
    expect(config.ATTACHED_ROW_HEIGHT).toBe(35 * 120 / 100);
    config.ATTACHED_ROW_HEIGHT = 40;
    expect(config.ATTACHED_ROW_HEIGHT).toBe(40 * 120 / 100);
    config.sizeRatioPercent = 150;
    expect(config.ATTACHED_ROW_HEIGHT).toBe(40 * 150 / 100);
  });

  test('TIME_UNIT_WIDTH should apply sizeRatioPercent', () => {
    expect(config.TIME_UNIT_WIDTH).toBe(250 * 120 / 100); // 初始值
    config.TIME_UNIT_WIDTH = 300;
    expect(config.TIME_UNIT_WIDTH).toBe(300 * 120 / 100); // 设置后仍使用旧比例
    config.sizeRatioPercent = 150;
    expect(config.TIME_UNIT_WIDTH).toBe(300 * 150 / 100); // 新比例生效
  });

  test('ROW_HEIGHT should apply sizeRatioPercent', () => {
    expect(config.ROW_HEIGHT).toBe(90 * 120 / 100); // 初始值

    config.ROW_HEIGHT = 100;
    expect(config.ROW_HEIGHT).toBe(100 * 120 / 100); // 设置后仍使用旧比例

    config.sizeRatioPercent = 150;
    expect(config.ROW_HEIGHT).toBe(100 * 150 / 100); // 新比例生效
  });
});