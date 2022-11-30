import { globalParameters as gpars, } from "../globalparameters.js";
export class GraphicLayer {
    constructor(containerDiv) {
        this.resize = (sizeHandler) => {
            this.canvas.style.width = `${sizeHandler.width}px`;
            this.canvas.style.height = `${sizeHandler.height}px`;
            this.canvas.width = Math.ceil(sizeHandler.width * this.scaleFactor);
            this.canvas.height = Math.ceil(sizeHandler.height * this.scaleFactor);
            this.innerWidth = sizeHandler.innerWidth;
            this.innerHeight = sizeHandler.innerHeight;
            this.innerCoords = sizeHandler.innerCoords;
            this.context.scale(this.scaleFactor, this.scaleFactor);
        };
        this.toAlpha = (col, alpha) => {
            if (alpha === 1)
                return col;
            let alpha16 = Math.floor(alpha * 255)
                .toString(16)
                .toUpperCase();
            if (alpha16.length < 2)
                alpha16 = "0" + alpha16;
            return col + alpha16;
        };
        this.clipToInner = () => {
            const { context, innerWidth, innerHeight, innerCoords } = this;
            context.beginPath();
            context.rect(innerCoords.x0, innerCoords.y1, innerWidth, innerHeight);
            context.clip();
        };
        this.drawClear = () => {
            const context = this.context;
            context.save();
            context.clearRect(0, 0, this.width, this.height);
            context.restore();
        };
        this.drawBackground = () => {
            const context = this.context;
            context.save();
            context.fillStyle = gpars.plot.backgroundColour;
            context.fillRect(0, 0, this.width, this.height);
            context.restore();
        };
        this.drawBarsV = (x, y0, y1, width, pars = this.defaultPars) => {
            const { colour, strokeColour, strokeWidth, alpha } = pars;
            const [context, w] = [this.context, width];
            context.save();
            context.fillStyle = this.toAlpha(colour, alpha);
            context.strokeStyle = strokeColour;
            context.lineWidth = strokeWidth;
            this.clipToInner();
            let i = x.length;
            while (i--) {
                if (x.empty[i])
                    continue;
                if (colour)
                    context.fillRect(x[i] - w[i] / 2, y1[i], w[i], y0[i] - y1[i]);
                if (strokeColour)
                    context.strokeRect(x[i] - w[i] / 2, y1[i], w[i], y0[i] - y1[i]);
            }
            context.restore();
        };
        this.drawBarsH = (y, x0, x1, width, pars = this.defaultPars) => {
            const { colour, strokeColour, strokeWidth, alpha } = pars;
            const [context, w] = [this.context, width];
            context.save();
            context.fillStyle = this.toAlpha(colour, alpha);
            context.strokeStyle = strokeColour;
            context.lineWidth = strokeWidth;
            this.clipToInner();
            let i = y.length;
            while (i--) {
                if (y.empty[i])
                    continue;
                if (colour)
                    context.fillRect(x0[i], y[i] - w[i] / 2, x1[i] - x0[i], w[i]);
                if (strokeColour)
                    context.strokeRect(x0[i], y[i] - w[i] / 2, x1[i] - x0[i], w[i]);
            }
            context.restore();
        };
        this.drawPoints = (x, y, radius, pars = this.defaultPars) => {
            const context = this.context;
            const { colour, strokeColour, strokeWidth, alpha } = pars;
            context.save();
            context.fillStyle = this.toAlpha(colour, alpha);
            context.strokeStyle = strokeColour;
            context.lineWidth = strokeWidth;
            this.clipToInner();
            let i = x.length;
            while (i--) {
                if (x.empty[i])
                    continue;
                context.beginPath();
                context.arc(x[i], y[i], radius[i], 0, Math.PI * 2);
                if (strokeColour)
                    context.stroke();
                if (colour)
                    context.fill();
            }
            context.restore();
        };
        this.drawRectsHW = (x, y, h, w, pars = this.defaultPars) => {
            const context = this.context;
            const { colour, strokeColour, strokeWidth, alpha } = pars;
            context.save();
            context.fillStyle = this.toAlpha(colour, alpha);
            context.strokeStyle = strokeColour;
            context.lineWidth = strokeWidth;
            this.clipToInner();
            let i = x.length;
            while (i--) {
                if (x.empty[i])
                    continue;
                if (colour)
                    context.fillRect(x[i] - w[i] / 2, y[i] - h[i] / 2, h[i], w[i]);
                if (strokeColour)
                    context.strokeRect(x[i] - w[i] / 2, y[i] - h[i] / 2, h[i], w[i]);
            }
            context.restore();
        };
        this.drawRectsAB = (x0, y0, x1, y1, pars = this.defaultPars) => {
            const context = this.context;
            const { colour, strokeColour, strokeWidth, alpha } = pars;
            let i = x0.length;
            context.save();
            context.fillStyle = this.toAlpha(colour, alpha);
            context.strokeStyle = strokeColour;
            context.lineWidth = strokeWidth;
            while (i--) {
                const ws = x1[i] - x0[i];
                const hs = y0[i] - y1[i];
                context.fillRect(x0[i], y0[i], ws, -hs);
            }
            context.restore();
        };
        this.drawLine = (x, y, col = "black") => {
            const context = this.context;
            context.save();
            context.beginPath();
            context.strokeStyle = col;
            context.moveTo(x[0], y[0]);
            x.shift();
            y.shift();
            let i = x.length;
            while (i--) {
                context.lineTo(x[i], y[i]);
            }
            context.stroke();
            context.restore();
        };
        this.drawText = (x, y, labels, size = 20, rotate) => {
            const context = this.context;
            context.save();
            context.font = `${size}px Times New Roman`;
            let i = x.length;
            while (i--) {
                context.translate(x[i], y[i]);
                if (rotate)
                    context.rotate((rotate / 360) * Math.PI * 2);
                context.fillText(labels[i], 0, 0);
                context.translate(-x[i], -y[i]);
            }
            context.restore();
        };
        this.drawDim = (col = "rgba(120, 120, 120, 0.05)") => {
            const context = this.context;
            context.fillStyle = col;
            context.fillRect(0, 0, this.width, this.height);
        };
        this.drawWindow = (start, end, stroke = "rgba(0, 0, 0, 0.25)") => {
            const context = this.context;
            context.save();
            context.strokeStyle = stroke;
            context.setLineDash([5, 5]);
            context.clearRect(start[0], start[1], end[0] - start[0], end[1] - start[1]);
            context.restore();
        };
        this.containerDiv = containerDiv;
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.defaultPars = {
            colour: `#000000`,
            strokeColour: null,
            strokeWidth: null,
            alpha: 1,
            radius: 1,
        };
    }
    get width() {
        return parseInt(getComputedStyle(this.containerDiv).width, 10);
    }
    get height() {
        return parseInt(getComputedStyle(this.containerDiv).height, 10);
    }
    get scaleFactor() {
        return 3;
    }
}
