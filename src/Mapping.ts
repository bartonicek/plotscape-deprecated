import * as dtstr from "./datastructures.js";

export class Mapping extends Map<string, string> {
  constructor(...mappings: [dtstr.ValidMappings, string][]) {
    super([...mappings]);
  }
}
