import { Handler } from "./Handler.js";
export class MarkerHandler extends Handler {
    constructor(n) {
        super();
        this.isOfMembership = (index, membership) => {
            if (membership === 1)
                return true;
            const { current: curr, past } = this;
            if (membership === 128 && curr[index] > 1)
                return !!(curr[index] & 128);
            if (membership === 128)
                return !!(past[index] & 128);
            if (curr[index] > 1)
                return curr[index] >= membership;
            return past[index] >= membership;
        };
        this.updateCurrent = (at, membership) => {
            if (membership < 128 && at.length)
                this.anyPersistent = true;
            this.updated = new Int32Array(new Set([...this.updated, ...at]));
            this.clearCurrent(true);
            this.current.update(at, membership);
            this.broadcast("updateCurrent");
        };
        this.mergeCurrent = (keepTransient = false) => {
            if (!keepTransient)
                this.current.discardTransient();
            this.past.merge(this.current);
        };
        this.clearCurrent = (keepTransient = false) => {
            if (!keepTransient)
                this.past.discardTransient();
            this.current = new MembershipArray(this.past);
            this.broadcast("clearCurrent");
        };
        this.clearAll = () => {
            this.updated = new Int32Array();
            this.anyPersistent = false;
            this.current.clear();
            this.past.clear();
            this.broadcast("clearAll");
        };
        this.n = n;
        this.current = new MembershipArray(n);
        this.past = new MembershipArray(n);
        this.updated = new Int32Array();
        this.anyPersistent = false;
    }
}
class MembershipArray extends Uint8Array {
    constructor(arg) {
        const buffer = typeof arg === "number" ? new ArrayBuffer(arg) : arg;
        super(buffer);
        this.clear = () => this.fill(1);
        this.discardTransient = () => {
            let i = this.length;
            while (i--)
                this[i] = this[i] & ~128;
        };
        this.merge = (arr) => {
            let i = this.length;
            while (i--) {
                if (arr[i] === 1)
                    continue;
                this[i] = arr[i];
            }
        };
        this.update = (at, membership) => {
            let i = at.length;
            if (membership === 128) {
                while (i--)
                    this[at[i]] = this[at[i]] | 128;
                return;
            }
            while (i--)
                this[at[i]] = membership;
        };
        if (typeof arg === "number")
            this.fill(1);
    }
}
