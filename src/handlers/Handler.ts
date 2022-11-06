import * as funs from "../functions.js";

export class Handler {
  events: string[];
  consequences: string[];
  callbacks: Map<string, ((...args: any[]) => void)[]>;

  constructor() {
    this.callbacks = new Map();
  }

  registerEvents = (element: HTMLElement) => {
    this.events.forEach((action, i) => {
      element.addEventListener(action, (event) =>
        funs.throttle(this[this.consequences[i]](event), 100)
      );
    });
  };

  subscribe = (sub: Object) => {
    const ownProperties = Object.keys(this);
    Object.keys(sub).forEach((e) => {
      if (typeof sub[e] === "function" && ownProperties.includes(e)) {
        if (!this.callbacks.has(e)) this.callbacks.set(e, []);
        this.callbacks.set(e, [...this.callbacks.get(e), sub[e]]);
      }
    });
  };

  publish = (name: string, ...args: any[]) => {
    this.callbacks.get(name)?.forEach((e) => e(...args));
  };
}
