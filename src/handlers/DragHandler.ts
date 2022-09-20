import * as dtstr from "../datastructures.js";
import * as funs from "../functions.js";
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

    this.actions = ["mousedown", "mousemove", "mouseup"];
    this.consequences = ["startDrag", "whileDrag", "endDrag"];

    // Register mouse behavior on the container, throttled to 50ms
    this.actions.forEach((action, i) => {
      this.container.addEventListener(
        action,
        funs.throttle(this[this.consequences[i]], 50)
      );
    });
  }

  startDrag = (event: { offsetX: number; offsetY: number }) => {
    this.dragging = true;
    this.start = [event.offsetX, event.offsetY];
    this.notifyAll("startDrag");
  };

  whileDrag = (event: { offsetX: number; offsetY: number }) => {
    const { dragging, notifyAll } = this;
    if (dragging) {
      this.end = [event.offsetX, event.offsetY];
      const dist =
        (this.start[0] - this.end[0]) ** 2 + (this.start[1] - this.end[1]) ** 2;
      if (dist > 50) notifyAll("whileDrag");
    }
  };

  endDrag = () => {
    this.dragging = false;
    this.notifyAll("endDrag");
  };
}
