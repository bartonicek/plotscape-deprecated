import * as dtstr from "./datastructures.js";

/**
 * Copy an object with all of its (nested) properties. Use to avoid passing by reference.
 * @param x An object.
 * @returns A copy of `x`.
 */
const deeplyClone = (x: Object) => {
  return JSON.parse(JSON.stringify(x));
};

/**
 * Returns the length of an array
 * @param x An array
 * @returns Length (`number`)
 */
const length = (x: dtstr.VectorGeneric) => x.length;

/**
 * Return back the same array, unchanged.
 * @param x An array of values.
 * @returns The same array.
 */
const identity = (x: dtstr.VectorGeneric) => x;

/**
 * Sum an array
 * @param x An array of numbers
 * @returns Sum (`number`)
 */
const sum = (x: number[]) => {
  if (!x.length) return null;
  return x.reduce((a, b) => a + b, 0);
};

/**
 * Take the average of an array
 * @param x An array of numbers
 * @returns Mean (`number`)
 */
const mean = (x: number[]) => (x.length ? sum(x) / x.length : null);

/**
 * Take the minimum of an array
 * @param x An array of numbers
 * @returns Minimum (`number`)
 */
const min = (x: number[]) => (x.length ? Math.min(...x) : null);

/**
 * Take the maximum of an array
 * @param x An array of numbers
 * @returns Maximum (`number`)
 */
const max = (x: number[]) => (x.length ? Math.max(...x) : null);

/**
 * Capitalize the first letter of a string or an array of strings
 * @param x A `string` or an array of strings
 * @returns A `string` or an array of strings, equal shape as `x`
 */
const capitalize = (x: string | string[]) => {
  return typeof x === "string"
    ? x.charAt(0).toUpperCase() + x.slice(1)
    : x.map((e) => e.charAt(0).toUpperCase() + e.slice(1));
};

/**
 * Bin an array into equally sized bin and assigns each element to the nearest bin centroid
 * @param x An array of numbers
 * @param n Number of bins (`number`)
 * @returns An array of bin cetroids, equal length as `x`
 */
const bin = (x: number[], n = 5) => {
  if (!x.length) return null;
  const range = Math.max(...x) - Math.min(...x);
  const width = range / n;
  const breaks = Array.from(Array(n + 1), (e, i) => Math.min(...x) + i * width);
  const centroids = breaks.map((e, i) => (e + breaks[i - 1]) / 2);
  breaks.reverse();
  centroids.shift();
  return x
    .map((e) => breaks.findIndex((f) => e >= f))
    .map((e) => (e === 0 ? breaks.length - 2 : breaks.length - e - 1))
    .map((e) => centroids[e]);
};

/**
 * Take the quantile(s) of an array
 * @param x An array of numbers
 * @param q A quantile (`number`, between 0 and 1) or an array of quantiles
 * @returns A data quantile or an array of data quantiles
 */
const quantile = (x: number[], q: number | number[]) => {
  if (!x.length) return null;
  const sorted = x.sort((a, b) => a - b);

  // For a single quantile
  if (typeof q === "number") {
    const pos = q * (sorted.length - 1);
    const { lwr, uppr } = { lwr: Math.floor(pos), uppr: Math.ceil(pos) };
    return sorted[lwr] + (pos % 1) * (sorted[uppr] - sorted[lwr]);
  }

  // For multiple quantiles
  const pos = q.map((e) => e * (sorted.length - 1));
  const { lwr, uppr } = {
    lwr: pos.map((e) => Math.floor(e)),
    uppr: pos.map((e) => Math.ceil(e)),
  };
  return pos.map(
    (e, i) => sorted[lwr[i]] + (e % 1) * (sorted[uppr[i]] - sorted[lwr[i]])
  );
};

/**
 * Multiply two numbers or return a minimum or maximum limit, if the products exceeds either of them
 * @param a A `number`
 * @param b A `number`
 * @param limits An object with `min` and `max` properties
 * @returns Either `a * b` or `min` (if `a * b < min`) or `max` (if `a * b > max`)
 */
const gatedMultiply = (
  a: number,
  b: number,
  limits: { min: number; max: number }
): number => {
  if (a * b < limits.min) return limits.min;
  if (a * b > limits.max) return limits.max;
  return a * b;
};

/**
 * Returns indices of an array that match a particular value
 * @param x An array
 * @param value A value to be matched
 * @returns An array of indices
 */
const which = (x: dtstr.VectorGeneric, value: any) => {
  return x.map((e, i) => (e === value ? i : NaN)).filter((e) => !isNaN(e));
};

const match = <Type>(x: Type[], values: Type[]): number[] | null => {
  return x.map((e) => values.indexOf(e));
};

/**
 * Returns a unique value or array of values in an array
 * @param x An array
 * @returns A value (if all values in `x` are the same) or an array of values
 */
const unique = <Type>(x: Type[]): Type[] | Type | null => {
  const uniqueArray = Array.from(new Set(x));
  return uniqueArray.length === 1 ? uniqueArray[0] : uniqueArray;
};

const accessDeep = (obj: Object, ...props: string[]) => {
  return props.reduce((a, b) => a && a[b], obj);
};

const accessUnpeel = (obj: Object, ...props: string[]) => {
  const destination = props.pop();
  let result;
  for (let i = props.length; i >= 0; i--) {
    result = accessDeep(obj, ...props, destination) ?? null;
    if (result) break;
    props.pop();
  }
  return result;
};

const accessIndexed = (obj: any, index: number) => {
  // Deep-clone the object to retain structure
  const res = deeplyClone(obj);
  Object.keys(obj).forEach((e) => (res[e] = obj[e][index]));
  return res;
};

const throttle = (fun: Function, delay: number) => {
  let lastTime = 0;
  return (...args) => {
    const now = new Date().getTime();
    if (now - lastTime < delay) return;
    lastTime = now;
    fun(...args);
  };
};

// Function to construct "pretty" breaks, inspired by R's pretty()
const prettyBreaks = (x: number[], n = 4) => {
  const [min, max] = [Math.min(...x), Math.max(...x)];
  const range = max - min;
  const unitGross = range / n;
  const base = Math.floor(Math.log10(unitGross));
  const dists = [1, 2, 4, 5, 6, 8, 10].map(
    (e) => (e - unitGross / 10 ** base) ** 2
  );
  const unitNeat =
    10 ** base * [1, 2, 4, 5, 6, 8, 10][dists.indexOf(Math.min(...dists))];

  const big = Math.abs(base) > 4;
  const minNeat = Math.round(min / unitNeat) * unitNeat;
  const maxNeat = Math.round(max / unitNeat) * unitNeat;
  const middle = Array.from(
    Array(Math.floor((maxNeat - minNeat) / unitNeat - 1)),
    (e, i) => minNeat + (i + 1) * unitNeat
  );
  const breaks = [minNeat, ...middle, maxNeat].map((e) =>
    parseFloat(e.toFixed(4))
  );
  return big ? breaks.map((e) => e.toExponential()) : breaks;
};

// Finds the nearest pretty number for each
const toPretty = (x: number[], n = 5) => {
  const breaks = prettyBreaks(x, n);
  let i = x.length;
  const res = Array(x.length);
  while (i--) {
    const x2 = breaks.map((e) => (e - x[i]) ** 2);
    res[i] = breaks[x2.indexOf(Math.min(...x2))];
  }
  return res;
};

// arrEqual: Checks if two arrays are deeply equal
const arrEqual = <Type>(array1: Type[], array2: Type[]): boolean => {
  return (
    array1.length == array2.length && array1.every((e, i) => e === array2[i])
  );
};

const arrTranspose = (data: any[][]) => {
  return data[0].map((_, i) => data.map((row) => row[i]));
};

// uniqueRows: Gets the unique rows & corresponding row ids of a dataframe
// (stored as an array of arrays/list of columns).
// Runs faster than a for loop, even though the rows are created twice
const uniqueRows = (data: dtstr.VectorGeneric[][]) => {
  // Transpose dataframe from array of cols to array of rows & turn the rows into strings
  const stringDataT = data[0].map((_, i) =>
    JSON.stringify(data.map((row) => row[i]))
  );

  const stringValues = unique(stringDataT);
  const indices = (stringValues as string[]).map((e) =>
    stringDataT.flatMap((f, j) => (f === e ? j : []))
  );
  const values = indices.map((e) => {
    return data.map((f) => f[e[0]]);
  });

  return { values, indices };
};

const uniqueRowIds = (data: dtstr.VectorGeneric[][]) => {
  // Transpose dataframe from array of cols to array of rows & turn the rows into strings
  const stringRows = data[0].map((_, i) =>
    JSON.stringify(data.map((row) => row[i]))
  );
  const uniqueStringRows = unique(stringRows);
  return stringRows.map((e) => uniqueStringRows.indexOf(e));
};

const pointInRect = (
  point: [number, number], // x, y
  rect: [[number, number], [number, number]] // x0, x1, y0, y1
) => {
  return (
    (point[0] - rect[0][0]) * (point[0] - rect[1][0]) < 0 &&
    (point[1] - rect[0][1]) * (point[1] - rect[1][1]) < 0
  );
};

const rectOverlap = (
  rect1: [[number, number], [number, number]],
  rect2: [[number, number], [number, number]]
) => {
  const [p1x, p1y] = [0, 1].map((e) => rect1.map((f) => f[e]));
  const [p2x, p2y] = [0, 1].map((e) => rect2.map((f) => f[e]));
  return !(
    Math.max(...p1x) < Math.min(...p2x) ||
    Math.min(...p1x) > Math.max(...p2x) ||
    Math.max(...p1y) < Math.min(...p2y) ||
    Math.min(...p1y) > Math.max(...p2y)
  );
};

const vecDiff = (x: number[], y: number[]) => {
  return x.map((e, i) => e - y[i]);
};

// Function to test if point is inside polygon based on linear algebra.
// Hopefuly works. If not, try implementing the following:
// https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
const insidePoly = (point: number[], polygon: number[][], distance: number) => {
  const xmin = Math.min(...polygon.map((e) => e[0]));
  const ymin = Math.min(...polygon.map((e) => e[1]));
  const xmax = Math.max(...polygon.map((e) => e[0]));
  const ymax = Math.max(...polygon.map((e) => e[1]));

  if (
    point[0] < xmin ||
    point[0] > xmax ||
    point[1] < ymin ||
    point[1] > ymax
  ) {
    return false;
  }

  const inds1 = Array.from(Array(polygon.length), (e, i) => i);
  const inds2 = Array.from(Array(polygon.length), (e, i) => i);
  inds2.shift();
  inds2.push(0);
  const sides = inds1.map((e, i) => vecDiff(polygon[inds2[i]], polygon[e]));
  const intersections = polygon.map((e, i) => {
    return [
      (point[1] - e[1]) / sides[i][1],
      ((point[1] - e[1]) / sides[i][1]) * sides[i][0] + e[0] - point[0],
    ];
  });
  const valid = intersections
    .map((e) => e[1])
    .filter((f) => f > 0 && f < distance);
  return valid.length % 2 === 1;
};

const timeExecution = (fun: Function) => {
  const start = performance.now();
  fun();
  const end = performance.now();
  return end - start;
};

export {
  identity,
  length,
  sum,
  mean,
  min,
  max,
  capitalize,
  bin,
  quantile,
  gatedMultiply,
  which,
  match,
  unique,
  throttle,
  accessDeep,
  accessUnpeel,
  accessIndexed,
  prettyBreaks,
  toPretty,
  arrEqual,
  arrTranspose,
  uniqueRows,
  uniqueRowIds,
  pointInRect,
  rectOverlap,
  timeExecution,
};
