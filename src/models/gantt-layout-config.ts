import { GanttLayoutConfigClassConstructor } from '@/types/gantt-layout-config';

const HEADER_HEIGHT = 70;
const ROW_HEIGHT = 80;
const TIME_UNIT_WIDTH = 200;
const SCROLL_WIDTH = 10;
const SCROLL_HEIGHT = 10;
const GRID_HEAD_CELL_WIDTH = 140;
const BAR_HEIGHT = 30;
const GRID_CELL_WIDTH = 400;
const MILESTONE_WIDTH = 20;
const ATTACHED_BAR_HEIGHT = 20;
const ATTACHED_ROW_HEIGHT = 30;
// 拖拽时，滚动条自动移动速率
const AUTO_SCROLL_AREA_SIZE = 50;
const AUTO_SCROLL_INTERVAL_MS = 8;
const AUTO_SCROLL_SHIFT_AMOUNT_X = 4;
const AUTO_SCROLL_SHIFT_AMOUNT_Y = 4;

export class GanttLayoutConfig {
  sizeRatioPercent:number;
  private _HEADER_HEIGHT :number;
  private _ROW_HEIGHT:number;
  private _TIME_UNIT_WIDTH:number;
  SCROLL_WIDTH:number;
  SCROLL_HEIGHT:number;
  private _GRID_HEAD_CELL_WIDTH:number;
  private _BAR_HEIGHT:number;
  private _GRID_CELL_WIDTH:number;
  private _MILESTONE_WIDTH:number;
  private _ATTACHED_BAR_HEIGHT:number;
  private _ATTACHED_ROW_HEIGHT:number;
  AUTO_SCROLL_AREA_SIZE:number;
  AUTO_SCROLL_INTERVAL_MS:number;
  AUTO_SCROLL_SHIFT_AMOUNT_X:number;
  AUTO_SCROLL_SHIFT_AMOUNT_Y:number;

  constructor(data:GanttLayoutConfigClassConstructor) {
    this.sizeRatioPercent = data.sizeRatioPercent || 100;
    this._HEADER_HEIGHT = data.HEADER_HEIGHT || HEADER_HEIGHT;
    this._ROW_HEIGHT = data.ROW_HEIGHT || ROW_HEIGHT;
    this._TIME_UNIT_WIDTH = data.TIME_UNIT_WIDTH || TIME_UNIT_WIDTH;
    this.SCROLL_WIDTH = data.SCROLL_WIDTH || SCROLL_WIDTH;
    this.SCROLL_HEIGHT = data.SCROLL_HEIGHT || SCROLL_HEIGHT;
    this._GRID_HEAD_CELL_WIDTH = data.GRID_HEAD_CELL_WIDTH || GRID_HEAD_CELL_WIDTH;
    this._BAR_HEIGHT = data.BAR_HEIGHT || BAR_HEIGHT;
    this._GRID_CELL_WIDTH = data.GRID_CELL_WIDTH || GRID_CELL_WIDTH;
    this._MILESTONE_WIDTH = data.MILESTONE_WIDTH || MILESTONE_WIDTH;
    this._ATTACHED_BAR_HEIGHT = data.ATTACHED_BAR_HEIGHT || ATTACHED_BAR_HEIGHT;
    this._ATTACHED_ROW_HEIGHT = data.ATTACHED_ROW_HEIGHT || ATTACHED_ROW_HEIGHT;
    this.AUTO_SCROLL_AREA_SIZE = data.AUTO_SCROLL_AREA_SIZE || AUTO_SCROLL_AREA_SIZE;
    this.AUTO_SCROLL_INTERVAL_MS = data.AUTO_SCROLL_INTERVAL_MS || AUTO_SCROLL_INTERVAL_MS;
    this.AUTO_SCROLL_SHIFT_AMOUNT_X = data.AUTO_SCROLL_SHIFT_AMOUNT_X || AUTO_SCROLL_SHIFT_AMOUNT_X;
    this.AUTO_SCROLL_SHIFT_AMOUNT_Y = data.AUTO_SCROLL_SHIFT_AMOUNT_Y || AUTO_SCROLL_SHIFT_AMOUNT_Y; 
  }

  get HEADER_HEIGHT() {
    return this._HEADER_HEIGHT * this.sizeRatioPercent / 100;
  }

  set HEADER_HEIGHT(val) {
    this._HEADER_HEIGHT = val;
  }

  get ROW_HEIGHT() {
    return this._ROW_HEIGHT * this.sizeRatioPercent / 100;
  }

  set ROW_HEIGHT(val) {
    this._ROW_HEIGHT = val;
  }

  get TIME_UNIT_WIDTH() {
    return this._TIME_UNIT_WIDTH * this.sizeRatioPercent / 100;
  }

  set TIME_UNIT_WIDTH(val) {
    this._TIME_UNIT_WIDTH = val;
  }

  get GRID_HEAD_CELL_WIDTH() {
    return this._GRID_HEAD_CELL_WIDTH * this.sizeRatioPercent / 100;
  }

  set GRID_HEAD_CELL_WIDTH(val) {
    this._GRID_HEAD_CELL_WIDTH = val;
  }

  get BAR_HEIGHT() {
    return this._BAR_HEIGHT * this.sizeRatioPercent / 100;
  }

  set BAR_HEIGHT(val) {
    this._BAR_HEIGHT = val;
  }

  get GRID_CELL_WIDTH() {
    return this._GRID_CELL_WIDTH * this.sizeRatioPercent / 100;
  }

  set GRID_CELL_WIDTH(val) {
    this._GRID_CELL_WIDTH = val;
  }

  get MILESTONE_WIDTH() {
    return this.MILESTONE_WIDTH * this.sizeRatioPercent / 100;
  }

  set MILESTONE_WIDTH(val) {
    this._MILESTONE_WIDTH = val;
  }

  get ATTACHED_BAR_HEIGHT() {
    return this._ATTACHED_BAR_HEIGHT * this.sizeRatioPercent / 100;
  }

  set ATTACHED_BAR_HEIGHT(val) {
    this._ATTACHED_BAR_HEIGHT = val;
  }

  get ATTACHED_ROW_HEIGHT() {
    return this._ATTACHED_ROW_HEIGHT * this.sizeRatioPercent / 100;
  }

  set ATTACHED_ROW_HEIGHT(val) {
    this._ATTACHED_ROW_HEIGHT = val;
  }
}