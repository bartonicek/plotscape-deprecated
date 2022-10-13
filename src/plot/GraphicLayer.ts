import * as dtstr from "../datastructures.js";
import {
  globalParameters as gpars,
  SingleValuedRepPars,
} from "../globalparameters.js";

export class GraphicLayer {
  globals: dtstr.Globals;
  dimensions: { width: number; height: number };
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  constructor(
    globals: dtstr.Globals,
    dimensions: { height: number; width: number }
  ) {
    this.globals = globals;
    this.dimensions = dimensions;
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    this.resize();
  }

  get width() {
    if (this.dimensions) return this.dimensions.width;
    return this.globals.size.plotWidth;
  }

  get height() {
    if (this.dimensions) return this.dimensions.height;
    return this.globals.size.plotHeight;
  }

  get scaleFactor() {
    return this.globals.size.scaleFactor;
  }

  resize = () => {
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.canvas.width = Math.ceil(this.width * this.scaleFactor);
    this.canvas.height = Math.ceil(this.height * this.scaleFactor);
    this.context.scale(this.scaleFactor, this.scaleFactor);
  };

  dropMissing = (...vectors: any[]) => {
    let i = vectors[0].length;
    while (i--) {
      if (vectors.map((e) => e[i]).some((e) => e === null || e < 0))
        vectors.map((e) => e.splice(i, 1));
    }
    return vectors;
  };

  toAlpha = (col: string, alpha: number) => {
    if (alpha === 1) return col;
    let alpha16 = Math.floor(alpha * 255)
      .toString(16)
      .toUpperCase();
    if (alpha16.length < 2) alpha16 = "0" + alpha16;
    return col + alpha16;
  };

  drawClear = () => {
    const context = this.context;
    context.save();
    context.clearRect(0, 0, this.width, this.height);
    context.restore();
  };

  drawBackground = () => {
    const context = this.context;
    context.save();
    context.fillStyle = gpars.plot.backgroundColour;
    context.fillRect(0, 0, this.width, this.height);
    context.restore();
  };

  drawBarsV = (
    x: number[],
    y: number[],
    y0: number[],
    width: number[],
    pars: SingleValuedRepPars
  ) => {
    const [xs, ys, y0s, ws] = this.dropMissing(x, y, y0, width);
    const { colour, strokeColour, strokeWidth, alpha } = pars;
    const context = this.context;
    context.save();
    context.fillStyle = this.toAlpha(colour, alpha);
    context.strokeStyle = strokeColour;
    context.lineWidth = strokeWidth;
    xs.forEach((e, i) => {
      if (colour) context.fillRect(e - ws[i] / 2, ys[i], ws[i], y0s[i] - ys[i]);
      if (strokeColour)
        context.strokeRect(e - ws[i] / 2, ys[i], ws[i], y0s[i] - ys[i]);
    });
    context.restore();
  };

  drawPoints = (
    x: number[],
    y: number[],
    radius: number[],
    pars: SingleValuedRepPars
  ) => {
    const context = this.context;
    const { colour, strokeColour, strokeWidth, alpha } = pars;
    context.save();
    context.fillStyle = this.toAlpha(colour, alpha);
    context.strokeStyle = strokeColour;
    context.lineWidth = strokeWidth;
    x.forEach((e, i) => {
      context.beginPath();
      context.arc(e, y[i], radius[i] / 2, 0, Math.PI * 2);
      if (strokeColour) context.stroke();
      if (colour) context.fill();
    });
    context.restore();
  };

  drawRectsHW = (
    x: number[],
    y: number[],
    h: number[],
    w: number[],
    pars: SingleValuedRepPars
  ) => {
    const context = this.context;
    const { colour, strokeColour, strokeWidth, alpha } = pars;
    context.save();
    context.fillStyle = this.toAlpha(colour, alpha);
    context.strokeStyle = strokeColour;
    context.lineWidth = strokeWidth;
    x.forEach((e, i) => {
      if (colour) context.fillRect(e - w[i] / 2, y[i] - h[i] / 2, h[i], w[i]);
      if (strokeColour)
        context.strokeRect(e - w[i] / 2, y[i] - h[i] / 2, h[i], w[i]);
    });
    context.restore();
  };

  drawLine = (x: number[], y: number[], col = "black") => {
    const context = this.context;
    context.save();
    context.beginPath();
    context.strokeStyle = col;
    context.moveTo(x[0], y[0]);
    x.shift();
    y.shift();
    x.forEach((e, i) => {
      context.lineTo(e, y[i]);
    });
    context.stroke();
    context.restore();
  };

  drawText = (
    x: number[],
    y: number[],
    labels: string[],
    size = 20,
    rotate?: number
  ) => {
    const context = this.context;
    context.save();
    context.font = `${size}px Times New Roman`;
    x.forEach((e, i) => {
      context.translate(e, y[i]);
      if (rotate) context.rotate((rotate / 360) * Math.PI * 2);
      context.fillText(labels[i], 0, 0);
      context.translate(-e, -y[i]);
    });
    context.restore();
  };

  drawDim = (col = "rgba(120, 120, 120, 0.1)") => {
    const context = this.context;
    context.fillStyle = col;
    context.fillRect(0, 0, this.width, this.height);
  };

  drawWindow = (
    start: [number, number],
    end: [number, number],
    stroke = "rgba(0, 0, 0, 0.25)"
  ) => {
    const context = this.context;
    context.save();
    context.strokeStyle = stroke;
    context.setLineDash([5, 5]);
    context.clearRect(start[0], start[1], end[0] - start[0], end[1] - start[1]);
    context.restore();
  };
}
