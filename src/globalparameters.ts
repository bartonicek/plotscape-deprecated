export const globalParameters = {
  plot: {
    backgroundColour: `#f2efde`,
  },
  reps: {
    colour: [`#cccccc`, `#1b9e77`, `#d95f02`, `#7570b3`, `#ffffffCC`],
    strokeColour: [null, null, null, null, `#000000`],
    strokeWidth: [null, null, null, null, 1],
    radius: [1, 1, 1, 1, 1],
    alpha: [1, 1, 1, 1, 1],
  },
};

export type SingleValuedRepPars = {
  [key in keyof typeof globalParameters.reps]: typeof globalParameters.reps[key][number];
};
export type RepParsWide = SingleValuedRepPars[];
