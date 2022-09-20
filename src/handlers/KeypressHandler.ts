import * as funs from "../functions.js";
import { Handler } from "./Handler.js";

export class KeypressHandler extends Handler {
  validKeys: string[];
  redrawKeys: string[];
  pressing: boolean;
  lastPressed: string;
  currentlyPressed: boolean[];

  constructor() {
    super();
    this.callbacks = [];
    this.validKeys = [
      "Equal",
      "Minus",
      "BracketLeft",
      "BracketRight",
      "ControlLeft",
      "ShiftLeft",
      "KeyR",
      "Digit1",
      "Digit2",
    ];
    this.redrawKeys = ["Equal", "Minus", "BracketLeft", "BracketRight", "KeyR"];
    this.pressing = false;
    this.lastPressed = "";
    this.currentlyPressed = Array(this.validKeys.length).fill(false);
    this.actions = ["keydown", "keyup"];
    this.consequences = ["keyPressed", "keyReleased"];

    // Register key press/release behavior on the document body
    this.actions.forEach((action, i) => {
      document.body.addEventListener(action, (event) =>
        funs.throttle(this[this.consequences[i]](event), 100)
      );
    });
  }

  get isRedrawKey() {
    return this.redrawKeys.includes(this.lastPressed);
  }

  get currentlyPressedKeys() {
    return this.validKeys.filter((_, i) => this.currentlyPressed[i]);
  }

  keyPressed = (event: { code: string }) => {
    if (this.pressing && !this.isRedrawKey) return;
    this.pressing = true;
    if (this.validKeys.includes(event.code)) {
      this.lastPressed = event.code;
      this.currentlyPressed[this.validKeys.indexOf(event.code)] = true;
      this.notifyAll("keyPressed");
    }
  };

  keyReleased = (event: { code: string }) => {
    this.pressing = false;
    if (this.validKeys.includes(event.code)) {
      this.currentlyPressed[this.validKeys.indexOf(event.code)] = false;
      this.notifyAll("keyReleased");
    }
  };

  isPressed = (key: string) => {
    return this.currentlyPressed.filter((_, i) => this.validKeys[i] === key)[0];
  };
}
