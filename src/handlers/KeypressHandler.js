import { Handler } from "./Handler.js";
export class KeypressHandler extends Handler {
    constructor() {
        super();
        this.keyPressed = (event) => {
            if (this.pressing && !this.isRedrawKey)
                return;
            this.pressing = true;
            if (this.validKeys.includes(event.code)) {
                event.preventDefault();
                this.lastPressed = event.code;
                this.currentlyPressed[this.validKeys.indexOf(event.code)] = true;
                this.broadcast("keyPressed", event.code);
            }
        };
        this.keyReleased = (event) => {
            this.pressing = false;
            if (this.validKeys.includes(event.code)) {
                this.currentlyPressed[this.validKeys.indexOf(event.code)] = false;
                this.broadcast("keyReleased", event.code);
            }
        };
        this.isPressed = (key) => {
            return this.currentlyPressed.filter((_, i) => this.validKeys[i] === key)[0];
        };
        this.validKeys = [
            "Equal",
            "Minus",
            "BracketLeft",
            "BracketRight",
            "ControlLeft",
            "ShiftLeft",
            "KeyR",
            "KeyZ",
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
}
