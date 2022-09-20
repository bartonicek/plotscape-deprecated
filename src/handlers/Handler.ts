export class Handler {
  actions: string[];
  consequences: string[];
  callbacks: (() => void)[];
  when: string[];

  constructor() {
    this.callbacks = [];
    this.when = [];
  }

  registerCallbacks = (callbacks: (() => void)[], when: string[]) => {
    this.callbacks.push(...callbacks);
    this.when.push(...when);
    return this;
  };

  notifyAll = (when: keyof this) => {
    this.callbacks
      .filter((e, i) => this.when[i] === when)
      .forEach((callback) => callback());
  };
}
