import { Handler } from "./Handler.js";
export class StateHandler extends Handler {
    constructor() {
        super();
        this.updateBools = (index, value) => {
            const { states, keyStateValues } = this;
            const stateIndex = states.findIndex((e) => keyStateValues[index] === e);
            this.stateBool[stateIndex] = value;
            this.membershipBool[index] = value;
        };
        this.keyPressed = (key) => {
            if (this.keys.includes(key)) {
                const index = this.keys.findIndex((e) => e === key);
                this.updateBools(index, true);
            }
        };
        this.keyReleased = (key) => {
            if (this.keys.includes(key)) {
                const index = this.keys.findIndex((e) => e === key);
                this.updateBools(index, false);
            }
        };
        this.activate = (id) => {
            this.plotsActive[this.plotIds.indexOf(id)] = true;
            this.containerDivs[this.plotIds.indexOf(id)].classList.add("active");
        };
        this.activateAll = () => {
            this.plotsActive.fill(true);
            this.containerDivs.forEach((e) => e.classList.add("active"));
        };
        this.deactivateAll = () => {
            this.plotsActive.fill(false);
            this.containerDivs.forEach((e) => e.classList.remove("active"));
        };
        this.isActive = (id) => {
            return this.plotsActive[this.plotIds.indexOf(id)];
        };
        this.plotIds = [];
        this.plotsActive = [];
        this.containerDivs = [];
        this.states = ["not", "or"];
        this.keys = ["ControlLeft", "ShiftLeft", "Digit1", "Digit2", "Digit3"];
        this.keyStateValues = ["not", "or", "or", "or", "or"];
        this.keyMembershipValues = [1, 128, 2, 3, 4];
        this.stateBool = Array(this.states.length).fill(false);
        this.membershipBool = Array(this.keyMembershipValues.length).fill(false);
    }
    get none() {
        return !this.stateBool.some((e) => e);
    }
    get or() {
        return [1, 2, 3, 4].some((e) => this.stateBool[e]);
    }
    get membershipId() {
        let [id, i] = [-1, this.membershipBool.length];
        while (i--) {
            if (this.membershipBool[i]) {
                id = i;
                break;
            }
        }
        return id;
    }
    get membership() {
        var _a;
        return (_a = this.keyMembershipValues[this.membershipId]) !== null && _a !== void 0 ? _a : 128;
    }
}
