import { Handler } from "./Handler.js";
export class SizeHandler extends Handler {
    constructor(plot) {
        super();
        this.resize = () => {
            this.width = this.plot.width;
            this.height = this.plot.height;
        };
        this.pctAlong = (along, percent) => {
            return along === "x" ? this.width * percent : this.height * (1 - percent);
        };
        this.plot = plot;
        this.width = plot.width;
        this.height = plot.height;
    }
    get fontsize() {
        return Math.floor(Math.min(this.width, this.height) * 0.05);
    }
    get margins() {
        return {
            bottom: 4 * this.fontsize,
            left: 4 * this.fontsize,
            top: 2 * this.fontsize,
            right: 2 * this.fontsize,
        };
    }
    get innerWidth() {
        return this.width - this.margins.left - this.margins.right;
    }
    get innerHeight() {
        return this.height - this.margins.bottom - this.margins.top;
    }
    get innerCoords() {
        return {
            x0: this.margins.left,
            x1: this.width - this.margins.right,
            y0: this.height - this.margins.bottom,
            y1: this.height - this.margins.bottom - this.innerHeight,
        };
    }
}
