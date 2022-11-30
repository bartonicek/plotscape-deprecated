import * as dtstr from "../datastructures.js";
import { Handler } from "./Handler.js";
import { StateHandler } from "./StateHandler.js";

export class DragHandler extends Handler {
  state: StateHandler;
  container: HTMLElement;
  dragging: boolean;
  hasDragged: boolean;
  start: dtstr.Point;
  previous: dtstr.Point;
  end: dtstr.Point;

  constructor(container: HTMLElement) {
    super();
    this.container = container;
    this.dragging = false;
    this.hasDragged = false;
    this.start = [null, null];
    this.previous = [null, null];
    this.end = [null, null];

    this.events = ["mousedown", "mousemove", "mouseup"];
    this.consequences = ["startDrag", "whileDrag", "endDrag"];
    this.registerEvents(this.container);
  }

  startDrag = (event: { offsetX: number; offsetY: number }) => {
    this.dragging = true;
    this.start = [event.offsetX, event.offsetY];
    this.previous = [event.offsetX, event.offsetY];
    this.broadcast("startDrag");
  };

  whileDrag = (event: { offsetX: number; offsetY: number }) => {
    const { dragging, start, end } = this;
    if (dragging) {
      if (this.hasDragged) this.previous = [this.end[0], this.end[1]];
      this.hasDragged = true;
      this.end = [event.offsetX, event.offsetY];
      const dist = (start[0] - end[0]) ** 2 + (start[1] - end[1]) ** 2;
      if (dist > 50) this.broadcast("whileDrag");
    }
  };

  endDrag = () => {
    this.dragging = false;
    this.hasDragged = false;
    this.start = [null, null];
    this.previous = [null, null];
    this.end = [null, null];
    this.broadcast("endDrag");
  };
}
