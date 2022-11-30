import { Handler } from "./Handler.js";

export class ClickHandler extends Handler {
  container: HTMLElement;
  holding: boolean;
  button: number;
  positionCurrent: [number, number];
  positionLast: [number, number];

  constructor(container: HTMLElement) {
    super();
    this.container = container;
    this.button = -1;
    this.holding = false;
    this.positionCurrent = [null, null];
    this.positionLast = [null, null];

    this.events = ["mousedown", "mouseup"];
    this.consequences = ["mouseDown", "mouseUp"];
    this.registerEvents(this.container);
  }

  mouseDown = (event: MouseEvent) => {
    this.holding = true;
    this.button = event.button;
    this.positionCurrent = [event.offsetX, event.offsetY];
    this.positionLast = [event.offsetX, event.offsetY];
    this.broadcast("mouseDown");
  };

  mouseUp = (event: { offsetX: number; offsetY: number }) => {
    this.holding = false;
    this.button = -1;
    this.positionCurrent = [null, null];
    this.broadcast("mouseUp");
  };
}
