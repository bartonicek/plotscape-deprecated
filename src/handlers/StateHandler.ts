import * as dtstr from "../datastructures.js";
import { Handler } from "./Handler.js";
import { KeypressHandler } from "./KeypressHandler.js";

export class StateHandler extends Handler {
  keypressHandler: KeypressHandler;
  plotIds: string[];
  plotsActive: boolean[];
  containerDivs: any[];
  states: string[];
  keys: string[];
  keyStateValues: string[];
  stateBool: boolean[];
  keyMembershipValues: dtstr.ValidMemberships[];
  membershipBool: boolean[];

  constructor() {
    super();
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
    return this.keyMembershipValues[this.membershipId] ?? 128;
  }

  updateBools = (index: number, value: boolean) => {
    const { states, keyStateValues } = this;
    const stateIndex = states.findIndex((e) => keyStateValues[index] === e);
    this.stateBool[stateIndex] = value;
    this.membershipBool[index] = value;
  };

  keyPressed = (key: string) => {
    if (this.keys.includes(key)) {
      const index = this.keys.findIndex((e) => e === key);
      this.updateBools(index, true);
    }
  };

  keyReleased = (key: string) => {
    if (this.keys.includes(key)) {
      const index = this.keys.findIndex((e) => e === key);
      this.updateBools(index, false);
    }
  };

  activate = (id: string) => {
    this.plotsActive[this.plotIds.indexOf(id)] = true;
    this.containerDivs[this.plotIds.indexOf(id)].classList.add("active");
  };

  activateAll = () => {
    this.plotsActive.fill(true);
    this.containerDivs.forEach((e) => e.classList.add("active"));
  };

  deactivateAll = () => {
    this.plotsActive.fill(false);
    this.containerDivs.forEach((e) => e.classList.remove("active"));
  };

  isActive = (id: string) => {
    return this.plotsActive[this.plotIds.indexOf(id)];
  };

  // inState = (state: typeof this.states[number]) => {
  //   const { keypressHandler, states, keys } = this;
  //   if (state === "none" && !keypressHandler.currentlyPressed.some((e) => e))
  //     return true;
  //   return keypressHandler.isPressed(keys[states.indexOf(state)]);
  // };
}
