import * as dtstr from "../datastructures.js";
import { Handler } from "./Handler.js";

export class MarkerHandler extends Handler {
  n: number;
  current: MembershipArray;
  past: MembershipArray;

  constructor(n: number) {
    super();
    this.n = n;
    this.current = new MembershipArray(n);
    this.past = new MembershipArray(n);

    this.callbacks = [];
    this.when = [];
  }

  isOfMembership = (index: number, membership: dtstr.ValidMemberships) => {
    if (membership === 1) return true;
    const { current: curr, past } = this;
    if (membership === 128) {
      return curr[index] > 1 ? !!(curr[index] & 128) : !!(past[index] & 128);
    }
    return curr[index] > 1
      ? curr[index] >= membership
      : past[index] >= membership;
  };

  updateCurrent = (at: number[], membership: dtstr.ValidMemberships) => {
    this.clearCurrent();
    this.current.update(at, membership);
    this.notifyAll("updateCurrent");
  };

  mergeCurrent = () => {
    this.past.merge(this.current.asPersistent());
    this.notifyAll("mergeCurrent");
  };

  clearCurrent = () => {
    this.current = new MembershipArray([...this.past.asPersistent()]);
  };

  clearAll = () => {
    this.current.clear();
    this.past.clear();
  };
}

class MembershipArray extends Uint8Array {
  constructor(arg: number | number[]) {
    super(arg as unknown as ArrayBufferLike);
    if (typeof arg === "number") this.fill(1);
  }
  clear = () => this.fill(1);

  asPersistent = () => {
    const res = new MembershipArray(this.length);
    let i = this.length;
    while (i--) res[i] = this[i] & ~128;
    return res;
  };

  asTransient = () => {
    const res = new MembershipArray(this.length);
    let i = this.length;
    while (i--) res[i] = this[i] & ~128;
    return res;
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
