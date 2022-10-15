import * as dtstr from "../datastructures.js";
import { Handler } from "./Handler.js";
import { KeypressHandler } from "./KeypressHandler.js";

export class StateHandler extends Handler {
  keypressHandler: KeypressHandler;
  plotIds: string[];
  plotsActive: boolean[];
  plotContainers: any[];
  validStates: string[];
  stateKeys: string[];
  membershipArray: dtstr.ValidMemberships[];

  constructor() {
    super();
    this.plotIds = [];
    this.plotsActive = [];
    this.plotContainers = [];
    this.validStates = ["not", "or", "group1", "group2", "group3"];
    this.stateKeys = ["ControlLeft", "ShiftLeft", "Digit1", "Digit2", "Digit3"];
    this.membershipArray = [1, 128, 2, 3, 4];
  }

  get currentId() {
    const { stateKeys, keypressHandler } = this;
    let i = stateKeys.length;
    let id: number;

    while (i--) {
      if (keypressHandler.isPressed(stateKeys[i])) {
        id = i;
        break;
      }
    }
    return id ?? -1;
  }

  get current() {
    return this.validStates[this.currentId];
  }

  get membership() {
    return this.membershipArray[this.currentId] ?? 128;
  }

  activate = (id: string) => {
    this.plotsActive[this.plotIds.indexOf(id)] = true;
    this.plotContainers[this.plotIds.indexOf(id)].classList.add("active");
  };

  activateAll = () => {
    this.plotsActive.fill(true);
    this.plotContainers.forEach((e) => e.classList.add("active"));
  };

  deactivateAll = () => {
    this.plotsActive.fill(false);
    this.plotContainers.forEach((e) => e.classList.remove("active"));
  };

  isActive = (id: string) => {
    return this.plotsActive[this.plotIds.indexOf(id)];
  };

  inState = (state: typeof this.validStates[number]) => {
    const { keypressHandler, validStates, stateKeys } = this;
    if (state === "none" && !keypressHandler.currentlyPressed.some((e) => e))
      return true;
    return keypressHandler.isPressed(stateKeys[validStates.indexOf(state)]);
  };
}
