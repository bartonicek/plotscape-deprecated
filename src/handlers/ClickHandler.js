import { Handler } from "./Handler.js";
export class ClickHandler extends Handler {
    constructor(container) {
        super();
        this.mouseDown = (event) => {
            this.holding = true;
            this.button = event.button;
            this.positionCurrent = [event.offsetX, event.offsetY];
            this.positionLast = [event.offsetX, event.offsetY];
            this.broadcast("mouseDown");
        };
        this.mouseUp = (event) => {
            this.holding = false;
            this.button = -1;
            this.positionCurrent = [null, null];
            this.broadcast("mouseUp");
        };
        this.container = container;
        this.button = -1;
        this.holding = false;
        this.positionCurrent = [null, null];
        this.positionLast = [null, null];
        this.events = ["mousedown", "mouseup"];
        this.consequences = ["mouseDown", "mouseUp"];
        this.registerEvents(this.container);
    }
}
