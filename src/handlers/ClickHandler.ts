import { Handler } from "./Handler.js";

export class ClickHandler extends Handler {
  container: HTMLElement;
  holding: boolean;
  clickCurrent: [number, number];
  clickLast: [number, number];

  constructor(container: HTMLElement) {
    super();
    this.container = container;
    this.holding = false;
    this.clickCurrent = [null, null];
    this.clickLast = [null, null];

    this.events = ["mousedown", "mouseup"];
    this.consequences = ["mouseDown", "mouseUp"];
    this.registerEvents(this.container);
  }

  mouseDown = (event: { offsetX: number; offsetY: number }) => {
    this.holding = true;
    this.clickCurrent = [event.offsetX, event.offsetY];
    this.clickLast = [event.offsetX, event.offsetY];
    this.publish("mouseDown");
  };

  mouseUp = (event: { offsetX: number; offsetY: number }) => {
    this.holding = false;
    this.clickCurrent = [null, null];
    this.publish("mouseUp");
  };
}
