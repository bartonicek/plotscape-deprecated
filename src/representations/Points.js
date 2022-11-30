import * as dtstr from "../datastructures.js";
import * as sprs from "../sparsearrays.js";
import { Representation } from "./Representation.js";
export class Points extends Representation {
    constructor(wrangler) {
        super(wrangler);
        this.drawBase = (context) => {
            let [x, y, s] = this.getMappings(1, "x", "y", "size");
            const pars = Object.assign(Object.assign({}, this.getPars(1)), { alpha: this.alphaX });
            const { radiusD, sizeX } = this;
            let [i, s2] = [x.length, new sprs.SparseUint16Array(x.length)];
            // If size is a mapping, scale it, otherwise fill with default size
            while (i--)
                s2[i] = (s ? s[i] : 1) * pars.radius * radiusD * sizeX;
            context.drawPoints(x, y, s2, pars);
        };
        this.drawHighlight = (context) => {
            dtstr.highlightMembershipArray.forEach((e) => {
                let [x, y, s] = this.getMappings(e, "x", "y", "size");
                if (!(x.length > 0))
                    return;
                const pars = Object.assign(Object.assign({}, this.getPars(e)), { alpha: 1 });
                const { radiusD, sizeX } = this;
                let [i, s2] = [x.length, new sprs.SparseUint16Array(x.length)];
                while (i--)
                    s2[i] = (s ? s[i] : 1) * pars.radius * radiusD * sizeX;
                context.drawPoints(x, y, s2, pars);
            });
        };
        this.hasSize = !!wrangler.mapping.get("size");
    }
    get radiusD() {
        const { x, y } = this.scales;
        if (!x.continuous && !y.continuous) {
            return Math.min(x.breakWidth, y.breakWidth) / Math.sqrt(Math.PI);
        }
        const l = Math.min(Math.abs(x.plotRange), Math.abs(y.plotRange));
        const c = 10 * Math.log(this.wrangler.nCases);
        return l / c;
    }
    get boundingRects() {
        let [x, y, s] = this.getMappings(1, "x", "y", "size");
        const { pars, radiusD, sizeX } = this;
        const s2 = new sprs.SparseUint16Array(x.length);
        const c = 1 / Math.sqrt(2);
        let [i, res] = [x.length, Array(x.length)];
        while (i--) {
            s2[i] = (s ? s[i] : 1) * pars[0].radius * radiusD * sizeX;
            res[i] = [
                [x[i] - c * s2[i], y[i] - c * s2[i]],
                [x[i] + c * s2[i], y[i] + c * s2[i]],
            ];
        }
        return res;
    }
}
