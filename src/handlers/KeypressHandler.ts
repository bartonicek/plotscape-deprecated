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
      "Digit3",
    ];
    this.redrawKeys = ["Equal", "Minus", "BracketLeft", "BracketRight", "KeyR"];
    this.pressing = false;
    this.lastPressed = "";
    this.currentlyPressed = Array(this.validKeys.length).fill(false);

    this.events = ["keydown", "keyup"];
    this.consequences = ["keyPressed", "keyReleased"];
    this.registerEvents(document.body);
  }

  get isRedrawKey() {
    return this.redrawKeys.includes(this.lastPressed);
  }

  get currentlyPressedKeys() {
    return this.validKeys.filter((_, i) => this.currentlyPressed[i]);
  }

  keyPressed = (event: KeyboardEvent) => {
    if (this.pressing && !this.isRedrawKey) return;
    this.pressing = true;
    if (this.validKeys.includes(event.code)) {
      event.preventDefault();
      this.lastPressed = event.code;
      this.currentlyPressed[this.validKeys.indexOf(event.code)] = true;
      this.publish("keyPressed", event.code);
    }
  };

  keyReleased = (event: { code: string }) => {
    this.pressing = false;
    if (this.validKeys.includes(event.code)) {
      this.currentlyPressed[this.validKeys.indexOf(event.code)] = false;
      this.publish("keyReleased", event.code);
    }
  };

  isPressed = (key: string) => {
    return this.currentlyPressed.filter((_, i) => this.validKeys[i] === key)[0];
  };
}
