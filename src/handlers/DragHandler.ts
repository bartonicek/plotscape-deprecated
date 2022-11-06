import * as dtstr from "../datastructures.js";
import { Handler } from "./Handler.js";
import { StateHandler } from "./StateHandler.js";

export class DragHandler extends Handler {
  state: StateHandler;
  container: HTMLElement;
  dragging: boolean;
  start: dtstr.Point;
  end: dtstr.Point;

  constructor(container: HTMLElement) {
    super();
    this.container = container;
    this.dragging = false;
    this.start = [null, null];
    this.end = [null, null];

    this.events = ["mousedown", "mousemove", "mouseup"];
    this.consequences = ["startDrag", "whileDrag", "endDrag"];
    this.registerEvents(this.container);
  }

  startDrag = (event: { offsetX: number; offsetY: number }) => {
    this.dragging = true;
    this.start = [event.offsetX, event.offsetY];
    this.publish("startDrag");
  };

  whileDrag = (event: { offsetX: number; offsetY: number }) => {
    const { dragging, start, end } = this;
    if (dragging) {
      this.end = [event.offsetX, event.offsetY];
      const dist = (start[0] - end[0]) ** 2 + (start[1] - end[1]) ** 2;
      if (dist > 50) this.publish("whileDrag");
    }
  };

  endDrag = () => {
    this.dragging = false;
    this.publish("endDrag");
  };
}
