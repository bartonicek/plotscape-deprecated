// import { Auxiliary } from "./Auxiliary.js";
// import * as funs from "../functions.js";
// import { GraphicLayer } from "../plot/GraphicLayer.js";
// import { Plot } from "../main.js";
// import {
//   globalParameters as gpars,
//   SingleValuedRepPars,
// } from "../globalparameters.js";

// export class MaskingRects extends Auxiliary {
//   constructor(plot: Plot) {
//     super();
//   }

//   draw = (context: GraphicLayer) => {
//     const { x, y } = this.scales;
//     const [x0, x1, y0, y1] = [x.plotMin, x.plotMax, y.plotMin, y.plotMax];
//     const pars: SingleValuedRepPars = {
//       colour: gpars.plot.marginColour,
//       strokeColour: null,
//       strokeWidth: null,
//       radius: null,
//       alpha: 1,
//     };

//     context.drawRectsAB(
//       [x0, x0, x0, x1],
//       [y0, 0, y1, y1],
//       [x.lengthOriginal, 0, x.lengthOriginal, x.lengthOriginal],
//       [y.lengthOriginal, y.lengthOriginal, 0, y0],
//       pars
//     );
//   };

//   drawBase = (context: GraphicLayer) => {
//     this.draw(context);
//   };

//   drawHighlight = (context: GraphicLayer) => {
//     this.draw(context);
//   };
// }
