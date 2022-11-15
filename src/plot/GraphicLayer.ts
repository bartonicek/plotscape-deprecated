import * as sprs from "../sparsearrays.js";

import {
  globalParameters as gpars,
  SingleValuedRepPars,
} from "../globalparameters.js";

export class GraphicLayer {
  containerDiv: HTMLDivElement;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  defaultPars: SingleValuedRepPars;

  constructor(containerDiv: HTMLDivElement) {
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
    this.resize();
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

  resize = () => {
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.canvas.width = Math.ceil(this.width * this.scaleFactor);
    this.canvas.height = Math.ceil(this.height * this.scaleFactor);
    this.context.scale(this.scaleFactor, this.scaleFactor);
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
    x: sprs.SparseUint16Array,
    y0: sprs.SparseUint16Array,
    y1: sprs.SparseUint16Array,
    width: sprs.SparseUint16Array,
    pars = this.defaultPars
  ) => {
    const { colour, strokeColour, strokeWidth, alpha } = pars;
    const [context, w] = [this.context, width];

    context.save();
    context.fillStyle = this.toAlpha(colour, alpha);
    context.strokeStyle = strokeColour;
    context.lineWidth = strokeWidth;

    let i = x.length;
    while (i--) {
      if (x.empty[i] || y0.empty[i] || y1.empty[i] || width.empty[i]) continue;
      if (colour) context.fillRect(x[i] - w[i] / 2, y1[i], w[i], y0[i] - y1[i]);
      if (strokeColour)
        context.strokeRect(x[i] - w[i] / 2, y1[i], w[i], y0[i] - y1[i]);
    }

    context.restore();
  };

  drawPoints = (
    x: sprs.SparseUint16Array,
    y: sprs.SparseUint16Array,
    radius: sprs.SparseUint16Array,
    pars = this.defaultPars,
    empty?: Uint8Array
  ) => {
    const context = this.context;
    const { colour, strokeColour, strokeWidth, alpha } = pars;

    context.save();
    context.fillStyle = this.toAlpha(colour, alpha);
    context.strokeStyle = strokeColour;
    context.lineWidth = strokeWidth;

    let i = x.length;
    while (i--) {
      if (x.empty[i] || y.empty[i] || radius.empty[i]) continue;
      context.beginPath();
      context.arc(x[i], y[i], radius[i], 0, Math.PI * 2);
      if (strokeColour) context.stroke();
      if (colour) context.fill();
    }

    context.restore();
  };

  drawRectsHW = (
    x: sprs.SparseUint16Array,
    y: sprs.SparseUint16Array,
    h: sprs.SparseUint16Array,
    w: sprs.SparseUint16Array,
    pars = this.defaultPars
  ) => {
    const context = this.context;
    const { colour, strokeColour, strokeWidth, alpha } = pars;

    context.save();
    context.fillStyle = this.toAlpha(colour, alpha);
    context.strokeStyle = strokeColour;
    context.lineWidth = strokeWidth;

    let i = x.length;
    while (i--) {
      // if (empty[i]) continue;
      if (colour)
        context.fillRect(x[i] - w[i] / 2, y[i] - h[i] / 2, h[i], w[i]);
      if (strokeColour)
        context.strokeRect(x[i] - w[i] / 2, y[i] - h[i] / 2, h[i], w[i]);
    }

    context.restore();
  };

  drawRectsAB = (
    x0: number[],
    y0: number[],
    x1: number[],
    y1: number[],
    pars = this.defaultPars
  ) => {
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

  drawLine = (x: number[], y: number[], col = "black") => {
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

    let i = x.length;
    while (i--) {
      context.translate(x[i], y[i]);
      if (rotate) context.rotate((rotate / 360) * Math.PI * 2);
      context.fillText(labels[i], 0, 0);
      context.translate(-x[i], -y[i]);
    }

    context.restore();
  };

  drawDim = (col = "rgba(120, 120, 120, 0.05)") => {
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
