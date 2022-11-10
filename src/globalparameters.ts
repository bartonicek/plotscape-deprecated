export const globalParameters = {
  plot: {
    scaleExpandFactor: 0.1,
    backgroundColour: `#F7F7F2`,
    marginColour: `#F7F7F2`,
  },
  reps: {
    colour: [`#cccccc`, `#7fc97f`, `#fdc086`, `#beaed4`, `#386cb0`],
    strokeColour: [null, `#7fc97f`, `#fdc086`, `#beaed4`, `#386cb0`],
    strokeWidth: [null, 1, 1, 1, 1],
    radius: [1, 1, 1, 1, 1],
    alpha: [1, 1, 1, 1, 1],
  },
};

export type SingleValuedRepPars = {
  [key in keyof typeof globalParameters.reps]: typeof globalParameters.reps[key][number];
};
export type RepParsWide = SingleValuedRepPars[];
