import * as dtstr from "../datastructures.js";
import { Handler } from "./Handler.js";

export class MarkerHandler extends Handler {
  n: number;
  current: MembershipArray;
  past: MembershipArray;
  updated: Int32Array;
  anyPersistent: boolean;

  constructor(n: number) {
    super();
    this.n = n;
    this.current = new MembershipArray(n);
    this.past = new MembershipArray(n);
    this.updated = new Int32Array();
    this.anyPersistent = false;
  }

  isOfMembership = (index: number, membership: dtstr.ValidMemberships) => {
    if (membership === 1) return true;

    const { current: curr, past } = this;
    if (membership === 128 && curr[index] > 1) return !!(curr[index] & 128);
    if (membership === 128) return !!(past[index] & 128);
    if (curr[index] > 1) return curr[index] >= membership;
    return past[index] >= membership;
  };

  updateCurrent = (at: number[], membership: dtstr.ValidMemberships) => {
    if (membership < 128 && at.length) this.anyPersistent = true;
    this.updated = new Int32Array(new Set([...this.updated, ...at]));
    console.log([...this.updated]);
    this.clearCurrent(true);
    this.current.update(at, membership);
    this.publish("updateCurrent");
  };

  mergeCurrent = (keepTransient = false) => {
    if (!keepTransient) this.current.discardTransient();
    this.past.merge(this.current);
  };

  clearCurrent = (keepTransient = false) => {
    if (!keepTransient) this.past.discardTransient();
    this.current = new MembershipArray(this.past);
    this.publish("clearAll");
  };

  clearAll = () => {
    this.updated = new Int32Array();
    this.anyPersistent = false;
    this.current.clear();
    this.past.clear();
  };
}

class MembershipArray extends Uint8Array {
  constructor(arg: number | ArrayBufferLike) {
    const buffer = typeof arg === "number" ? new ArrayBuffer(arg) : arg;
    super(buffer);
    if (typeof arg === "number") this.fill(1);
  }

  clear = () => this.fill(1);

  discardTransient = () => {
    let i = this.length;
    while (i--) this[i] = this[i] & ~128;
  };

  merge = (arr: MembershipArray) => {
    let i = this.length;
    while (i--) {
      if (arr[i] === 1) continue;
      this[i] = arr[i];
    }
  };

  update = (at: number[], membership: dtstr.ValidMemberships) => {
    let i = at.length;
    if (membership === 128) {
      while (i--) this[at[i]] = this[at[i]] | 128;
      return;
    }
    while (i--) this[at[i]] = membership;
  };
}
