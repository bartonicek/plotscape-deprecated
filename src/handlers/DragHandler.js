import { Handler } from "./Handler.js";
export class DragHandler extends Handler {
    constructor(container) {
        super();
        this.startDrag = (event) => {
            this.dragging = true;
            this.start = [event.offsetX, event.offsetY];
            this.previous = [event.offsetX, event.offsetY];
            this.broadcast("startDrag");
        };
        this.whileDrag = (event) => {
            const { dragging, start, end } = this;
            if (dragging) {
                if (this.hasDragged)
                    this.previous = [this.end[0], this.end[1]];
                this.hasDragged = true;
                this.end = [event.offsetX, event.offsetY];
                const dist = Math.pow((start[0] - end[0]), 2) + Math.pow((start[1] - end[1]), 2);
                if (dist > 50)
                    this.broadcast("whileDrag");
            }
        };
        this.endDrag = () => {
            this.dragging = false;
            this.hasDragged = false;
            this.start = [null, null];
            this.previous = [null, null];
            this.end = [null, null];
            this.broadcast("endDrag");
        };
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
}
