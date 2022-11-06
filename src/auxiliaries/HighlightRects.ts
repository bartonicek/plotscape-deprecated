import * as dtstr from "../datastructures.js";
import { GraphicLayer } from "../plot/GraphicLayer.js";
import { Auxiliary } from "./Auxiliary.js";

export class HighlightRects extends Auxiliary {
  bgDrawn: boolean;
  current: dtstr.Rect2Points;
  last: dtstr.Rect2Points;
  past: dtstr.Rect2Points[];
  empty: boolean;

  constructor(handlers: object) {
    super();
    this.current = [
      [null, null],
      [null, null],
    ];
    this.last = [
      [null, null],
      [null, null],
    ];
    this.past = [];
    this.empty = true;
    this.handlers = handlers;
    this.bgDrawn = false;
  }

  get lastComplete() {
    return !this.last.flat().some((e) => e === null);
  }

  updateCurrentOrigin = (point: dtstr.Point) => {
    this.current[0] = point;
  };

  updateCurrentEndpoint = (point: dtstr.Point) => {
    this.current[1] = point;
  };

  updateLast = () => {
    this.last = [this.current[0], this.current[1]];
    this.empty = false;
  };

  pushLastToPast = () => {
    this.past.push([this.last[0], this.last[1]]);
    this.empty = false;
  };

  clear = () => {
    this.last = [
      [null, null],
      [null, null],
    ];
    this.past = [];
    this.empty = true;
  };

  draw = (
    context: GraphicLayer,
    points: [[number, number], [number, number]]
  ) => {
    context.drawWindow(
      [points[0][0], points[0][1]],
      [points[1][0], points[1][1]]
    );
  };

  drawUser = (context: GraphicLayer) => {
    const { drag, state } = this.handlers;

    if (this.empty) {
      context.drawClear();
      return;
    }

    if (!state.none) {
      context.drawClear();
      context.drawDim();
      this.past.forEach((points) => {
        this.draw(context, points);
      });
      this.draw(context, this.last);
      return;
    }

    context.drawClear();
    context.drawDim();
    this.draw(context, this.last);
  };
}
