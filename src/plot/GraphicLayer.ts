import { globalParameters as gpars } from "../globalparameters.js";

export class GraphicLayer {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  backgroundColour: string;

  constructor(width: number, height: number) {
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    this.width = width;
    this.height = height;
    this.backgroundColour = gpars.bgCol;

    this.canvas.width = width;
    this.canvas.height = height;
  }

  dropMissing = (...vectors: any[]) => {
    let missingIndices = [...vectors].flatMap((vector) =>
      vector
        .flatMap((value, index) => (value === null ? index : []))
        .sort((a, b) => a - b)
    );
    missingIndices = Array.from(new Set(missingIndices));
    return [...vectors].map((vector) =>
      vector.flatMap((value, index) =>
        missingIndices.indexOf(index) === -1 ? value : []
      )
    );
  };

  toAlpha = (col: string, alpha: number) => {
    if (alpha === 1) return col;
    const alpha16 = Math.floor(alpha * 255)
      .toString(16)
      .toUpperCase();
    const colString = alpha16.length < 2 ? col + "0" + alpha16 : col + alpha16;
    return colString;
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
    context.fillStyle = gpars.bgCol;
    context.fillRect(0, 0, this.width, this.height);
    context.restore();
  };

  drawBarsV = (
    x: number[],
    y: number[],
    y0: number,
    pars = {
      col: gpars.reps.col[0],
      strokeCol: null,
      strokeWidth: null,
      alpha: 1,
      width: 50,
    }
  ) => {
    const [xs, ys] = this.dropMissing(x, y);
    const { col, strokeCol, strokeWidth, alpha, width } = pars;
    const context = this.context;
    context.save();
    context.fillStyle = this.toAlpha(col, alpha);
    context.strokeStyle = strokeCol;
    context.lineWidth = strokeWidth;
    xs.forEach((e, i) => {
      col ? context.fillRect(e - width / 2, ys[i], width, y0 - ys[i]) : null;
      strokeCol
        ? context.strokeRect(e - width / 2, ys[i], width, y0 - ys[i])
        : null;
    });
    context.restore();
  };

  drawPoints = (
    x: number[],
    y: number[],
    pars = {
      col: gpars.reps.col[0],
      radius: 5,
      strokeCol: null,
      strokeWidth: null,
      alpha: 1,
    }
  ) => {
    const context = this.context;
    const { col, radius, strokeCol, strokeWidth, alpha } = pars;
    const rs =
      typeof radius === "number"
        ? Array.from(Array(x.length), (e) => radius)
        : radius;
    context.save();
    context.fillStyle = this.toAlpha(col, alpha);
    context.strokeStyle = strokeCol;
    context.lineWidth = strokeWidth;
    x.forEach((e, i) => {
      context.beginPath();
      context.arc(e, y[i], rs[i], 0, Math.PI * 2);
      strokeCol ? context.stroke() : null;
      col ? context.fill() : null;
    });
    context.restore();
  };

  drawRectsHW = (
    x: number[],
    y: number[],
    h: number[],
    w: number[],
    pars = {
      col: gpars.reps.col[0],
      strokeCol: null,
      strokeWidth: null,
      alpha: 1,
    }
  ) => {
    const context = this.context;
    const { col, strokeCol, strokeWidth, alpha } = pars;
    context.save();
    context.fillStyle = this.toAlpha(col, alpha);
    context.strokeStyle = strokeCol;
    context.lineWidth = strokeWidth;
    x.forEach((e, i) => {
      col ? context.fillRect(e - w[i] / 2, y[i] - h[i] / 2, h[i], w[i]) : null;
      strokeCol
        ? context.strokeRect(e - w[i] / 2, y[i] - h[i] / 2, h[i], w[i])
        : null;
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
    context.textAlign = "center";
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
    // context.strokeRect(
    //   start[0],
    //   start[1],
    //   end[0] - start[0],
    //   end[1] - start[1]
    // );
    context.restore();
  };
}
