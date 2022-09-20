import { Handler } from "./Handler.js";
import * as funs from "../functions.js";
import { Plot } from "../plot/Plot.js";

export class ClickHandler extends Handler {
  container: HTMLElement;
  holding: boolean;
  clickCurrent: [number, number];
  clickLast: [number, number];
  //clickArray: [number, number][];

  constructor(container: HTMLElement) {
    super();
    this.container = container;
    this.holding = false;
    this.clickCurrent = [null, null];
    this.clickLast = [null, null];
    this.actions = ["mousedown", "mouseup"];
    this.consequences = ["mouseDown", "mouseUp"];

    // Register key press/release behavior on the document body
    this.actions.forEach((action, i) => {
      this.container.addEventListener(action, (event) =>
        this[this.consequences[i]](event)
      );
    });
  }

  mouseDown = (event: { offsetX: number; offsetY: number }) => {
    this.holding = true;
    this.clickCurrent = [event.offsetX, event.offsetY];
    this.clickLast = [event.offsetX, event.offsetY];
    this.notifyAll("mouseDown");
  };

  mouseUp = (event: { offsetX: number; offsetY: number }) => {
    this.holding = false;
    this.clickCurrent = [null, null];
    this.notifyAll("mouseUp");
  };
}
