import * as dtstr from "./datastructures.js";

const sort = (arr: any[]) => {
  if (typeof arr[0] === "number") return arr.sort((a, b) => a - b);
  return arr.sort();
};

/**
 * Copy an object with all of its (nested) properties. Use to avoid passing by reference.
 * @param x An object.
 * @returns A copy of `x`.
 */
const deeplyClone = (x: Object) => {
  return JSON.parse(JSON.stringify(x));
};

/**
 * Turn a value or an array into a string or array of strings
 * @param x A value or array
 * @returns A string or array of strings
 */
const stringify = (x: any | any[]) => {
  if (typeof x === "string" || typeof x[0] === "string") return x;
  return x.length ? x.map((e) => `${e}`) : `${x}`;
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
const min = (x: number[]) => (x.length ? Math.min.apply(null, x) : null);

/**
 * Take the maximum of an array
 * @param x An array of numbers
 * @returns Maximum (`number`)
 */
const max = (x: number[]) => (x.length ? Math.max.apply(null, x) : null);

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
  const minimum = min(x);
  const range = max(x) - minimum;
  const width = range / n;
  const breaks = Array.from(Array(n + 1), (e, i) => minimum + i * width);
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
  const res = deeplyClone(obj) as typeof obj; // Deeply-clone the object
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

const createStripePattern = (colour: string, size: number) => {
  const canv = document.createElement("canvas");
  canv.width = size;
  canv.height = size;
  const ctx = canv.getContext("2d");

  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, size / 4);
  ctx.lineTo(size / 4, 0);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, size);
  ctx.lineTo(size / 4, size);
  ctx.lineTo(size, size / 4);
  ctx.lineTo(size, 0);
  ctx.lineTo((3 * size) / 4, 0);
  ctx.lineTo(0, (3 * size) / 4);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(size, size);
  ctx.lineTo(size, (3 * size) / 4);
  ctx.lineTo((3 * size) / 4, size);
  ctx.lineTo(size, size);
  ctx.closePath();
  ctx.fill();

  return ctx.createPattern(canv, "repeat");
};

// Function to construct "pretty" breaks, inspired by R's pretty()
const prettyBreaks = (x: number[], n = 4) => {
  const [minimum, maximum] = [min(x), max(x)];
  const range = maximum - minimum;
  const unitGross = range / n;
  const base = Math.floor(Math.log10(unitGross));

  const neatValues = [1, 2, 4, 5, 10];
  const dists = neatValues.map((e) => (e - unitGross / 10 ** base) ** 2);
  const unitNeat = 10 ** base * neatValues[dists.indexOf(min(dists))];

  const big = Math.abs(base) > 4;
  const minimumNeat = Math.ceil(minimum / unitNeat) * unitNeat;
  const maximumNeat = Math.floor(maximum / unitNeat) * unitNeat;
  const middle = Array.from(
    Array(Math.round((maximumNeat - minimumNeat) / unitNeat - 1)),
    (_, i) => minimumNeat + (i + 1) * unitNeat
  );
  const breaks = [minimumNeat, ...middle, maximumNeat].map((e) =>
    parseFloat(e.toFixed(4))
  );
  return big ? breaks.map((e) => e.toExponential()) : breaks;
};

// Finds the nearest pretty number for each
const toPretty = (x: number[], n = 4) => {
  const breaks = prettyBreaks(x, n);
  let [i, res] = [x.length, Array(x.length)];
  while (i--) {
    const x2 = breaks.map((e) => (e - x[i]) ** 2);
    res[i] = breaks[x2.indexOf(min(x2))];
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
    max(p1x) < min(p2x) ||
    min(p1x) > max(p2x) ||
    max(p1y) < min(p2y) ||
    min(p1y) > max(p2y)
  );
};

const timeExecution = (fun: Function) => {
  const start = performance.now();
  fun();
  const end = performance.now();
  return end - start;
};

export {
  sort,
  deeplyClone,
  stringify,
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
  createStripePattern,
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
