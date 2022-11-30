import { Auxiliary } from "./Auxiliary.js";
export class HighlightRects extends Auxiliary {
    constructor(plot, handlers) {
        super(plot);
        this.updateCurrentOrigin = (point) => {
            this.current[0] = point;
        };
        this.updateCurrentEndpoint = (point) => {
            this.current[1] = point;
        };
        this.updateLast = () => {
            this.last = [this.current[0], this.current[1]];
            this.empty = false;
        };
        this.pushLastToPast = () => {
            this.past.push([this.last[0], this.last[1]]);
            this.empty = false;
        };
        this.clear = () => {
            this.last = [
                [null, null],
                [null, null],
            ];
            this.past = [];
            this.empty = true;
        };
        this.draw = (context, points) => {
            context.drawWindow([points[0][0], points[0][1]], [points[1][0], points[1][1]]);
        };
        this.drawUser = (context) => {
            const { drag, state } = this.handlers;
            if (this.empty) {
                context.drawClear();
                return;
            }
            if (!state.none) {
                context.drawClear();
                context.drawDim();
                this.past.forEach((points) => {
                    this.draw(context, points);
                });
                this.draw(context, this.last);
                return;
            }
            context.drawClear();
            context.drawDim();
            this.draw(context, this.last);
        };
        this.current = [
            [null, null],
            [null, null],
        ];
        this.last = [
            [null, null],
            [null, null],
        ];
        this.past = [];
        this.empty = true;
        this.handlers = handlers;
        this.bgDrawn = false;
    }
    get lastComplete() {
        return !this.last.flat().some((e) => e === null);
    }
}
