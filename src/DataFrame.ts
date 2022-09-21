import { VectorGeneric } from "./datastructures";

export class DataFrame {
  [key: string]: VectorGeneric;

  constructor(data: { [key: string]: VectorGeneric }) {
    Object.keys(data).forEach((e) => (this[e] = data[e]));
  }

  get _indicator() {
    return Array(this[Object.keys(this)[0]].length).fill(1);
  }
}
