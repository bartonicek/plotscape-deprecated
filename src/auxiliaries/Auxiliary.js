export class Auxiliary {
    constructor(plot) {
        this.registerScales = (scales) => {
            this.scales = scales;
            return this;
        };
        this.draw = (context, ...args) => { };
        this.drawBase = (context, ...args) => { };
        this.drawUser = (context, handler, ...args) => { };
        this.plot = plot;
    }
}
